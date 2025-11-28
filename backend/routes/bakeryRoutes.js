const express = require('express');
const router = express.Router();
const bakeryController = require('../controllers/bakeryController');

// GET /api/bakeries - 모든 빵집 조회
router.get('/', bakeryController.getAllBakeries);

// GET /api/bakeries/:id - 특정 빵집 조회
router.get('/:id', bakeryController.getBakeryById);

// POST /api/bakeries - 빵집 추가
router.post('/', bakeryController.createBakery);

// PUT /api/bakeries/:id - 빵집 수정
router.put('/:id', bakeryController.updateBakery);

// DELETE /api/bakeries/:id - 빵집 삭제
router.delete('/:id', bakeryController.deleteBakery);

module.exports = router;