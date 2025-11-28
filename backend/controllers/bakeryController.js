const Bakery = require('../models/Bakery');

// 모든 빵집 조회
exports.getAllBakeries = async (req, res) => {
  try {
    const bakeries = await Bakery.find().sort({ createdAt: -1 });
    res.json(bakeries);
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
};

// 특정 빵집 조회
exports.getBakeryById = async (req, res) => {
  try {
    const bakery = await Bakery.findById(req.params.id);
    if (!bakery) {
      return res.status(404).json({ message: '빵집을 찾을 수 없습니다.' });
    }
    res.json(bakery);
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
};

// 빵집 추가
exports.createBakery = async (req, res) => {
  try {
    const newBakery = new Bakery(req.body);
    const savedBakery = await newBakery.save();
    res.status(201).json(savedBakery);
  } catch (error) {
    res.status(400).json({ message: '빵집 추가 실패', error: error.message });
  }
};

// 빵집 수정
exports.updateBakery = async (req, res) => {
  try {
    const updatedBakery = await Bakery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBakery) {
      return res.status(404).json({ message: '빵집을 찾을 수 없습니다.' });
    }
    res.json(updatedBakery);
  } catch (error) {
    res.status(400).json({ message: '빵집 수정 실패', error: error.message });
  }
};

// 빵집 삭제
exports.deleteBakery = async (req, res) => {
  try {
    const deletedBakery = await Bakery.findByIdAndDelete(req.params.id);
    if (!deletedBakery) {
      return res.status(404).json({ message: '빵집을 찾을 수 없습니다.' });
    }
    res.json({ message: '빵집이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '빵집 삭제 실패', error: error.message });
  }
};