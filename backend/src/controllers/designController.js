const { validationResult } = require('express-validator');
const DesignService = require('../services/designService');

class DesignController {
  async getAllDesigns(req, res) {
    try {
      const { search, type } = req.query;
      
      let designs;
      if (search || type) {
        designs = await DesignService.searchDesigns(search, type);
      } else {
        designs = await DesignService.getAllActiveDesigns();
      }
      
      res.json(designs);

    } catch (error) {
      console.error('Designs fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch designs' });
    }
  }

  async createDesign(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Additional validation using service
      const validationErrors = DesignService.validateDesignData(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          errors: validationErrors.map(error => ({ message: error }))
        });
      }

      const result = await DesignService.createDesign(req.body);
      res.status(201).json(result);

    } catch (error) {
      console.error('Design creation error:', error);
      
      if (error.message.includes('required') || 
          error.message.includes('must be a positive number')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to add design' });
    }
  }

  async updateDesign(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const result = await DesignService.updateDesign(id, req.body);
      res.json(result);

    } catch (error) {
      console.error('Design update error:', error);
      
      if (error.message === 'Design not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (error.message.includes('must be a positive number') ||
          error.message === 'No fields to update') {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to update design' });
    }
  }

  async deleteDesign(req, res) {
    try {
      const { id } = req.params;
      const result = await DesignService.deleteDesign(id);
      res.json(result);

    } catch (error) {
      console.error('Design deletion error:', error);
      
      if (error.message === 'Design not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to delete design' });
    }
  }

  async getDesignById(req, res) {
    try {
      const { id } = req.params;
      const design = await DesignService.getDesignById(id);
      res.json(design);

    } catch (error) {
      console.error('Design fetch error:', error);
      
      if (error.message === 'Design not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to fetch design' });
    }
  }

  async getDesignTypes(req, res) {
    try {
      const types = await DesignService.getDesignTypes();
      res.json(types);

    } catch (error) {
      console.error('Design types error:', error);
      res.status(500).json({ error: 'Failed to fetch design types' });
    }
  }

  async getDesignStats(req, res) {
    try {
      const stats = await DesignService.getDesignStats();
      res.json(stats);

    } catch (error) {
      console.error('Design stats error:', error);
      res.status(500).json({ error: 'Failed to fetch design stats' });
    }
  }

  async getPopularDesigns(req, res) {
    try {
      const { limit = 10 } = req.query;
      const designs = await DesignService.getPopularDesigns(parseInt(limit));
      res.json(designs);

    } catch (error) {
      console.error('Popular designs error:', error);
      res.status(500).json({ error: 'Failed to fetch popular designs' });
    }
  }
}

module.exports = new DesignController();