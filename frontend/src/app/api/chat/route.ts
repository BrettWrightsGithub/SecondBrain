import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant that helps users manage their second brain - a personal knowledge management system. 
Be concise but informative. Format your responses using Markdown:

- Use **bold** for emphasis
- Use \`code blocks\` for code or technical terms
- Use bullet points for lists
- Use numbered lists for steps
- Use ### for section headers
- Use > for important quotes or notes
- Use \`\`\` for multi-line code blocks with language specification
- Use tables when comparing multiple items
- Use [links](URL) when referencing external resources

Always maintain clean, readable formatting.`;

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const { message } = await request.json();

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        // Send the initial message structure
        const initialMessage = {
          id: Date.now().toString(),
          content: "",
          sender: "system",
          timestamp: new Date().toISOString(),
          done: false
        };
        controller.enqueue(encoder.encode(JSON.stringify(initialMessage) + "\n"));

        try {
          let accumulatedContent = "";
          let lastChunkTime = Date.now();
          
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              accumulatedContent += content;
              
              // Only send update if enough time has passed (throttle updates)
              const now = Date.now();
              if (now - lastChunkTime > 50) { // Send update every 50ms
                const messageChunk = {
                  id: initialMessage.id,
                  content: accumulatedContent,
                  sender: "system",
                  timestamp: new Date().toISOString(),
                  done: false
                };
                controller.enqueue(encoder.encode(JSON.stringify(messageChunk) + "\n"));
                lastChunkTime = now;
              }
            }
          }

          // Send the final accumulated content
          const finalMessage = {
            id: initialMessage.id,
            content: accumulatedContent,
            sender: "system",
            timestamp: new Date().toISOString(),
            done: true
          };
          controller.enqueue(encoder.encode(JSON.stringify(finalMessage) + "\n"));
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      {
        message: {
          id: Date.now().toString(),
          content: 'Sorry, I encountered an error processing your message.',
          sender: "system",
          timestamp: new Date().toISOString(),
          done: true
        }
      },
      { status: 500 }
    );
  }
}
