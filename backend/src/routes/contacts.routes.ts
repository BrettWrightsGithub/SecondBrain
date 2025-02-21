import { Router, Request, Response } from 'express';
import { createContact, getContactById, updateContact } from '../models/contacts.model';

const router = Router();

// POST /api/contacts - Create a new contact
router.post('/', async (req: Request, res: Response) => {
  try {
    const contact = await createContact(req.body);
    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// GET /api/contacts/:id - Retrieve a contact by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const contact = await getContactById(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve contact' });
  }
});

// PUT /api/contacts/:id - Update contact information
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedContact = await updateContact(id, req.body);
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found or not updated' });
    }
    res.json(updatedContact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

export default router;
