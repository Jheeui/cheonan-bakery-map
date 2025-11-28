import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bakeries';

// 모든 빵집 조회
export const getAllBakeries = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('빵집 조회 실패:', error);
    throw error;
  }
};

// 특정 빵집 조회
export const getBakeryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('빵집 상세 조회 실패:', error);
    throw error;
  }
};

// 빵집 추가 (관리자용)
export const createBakery = async (bakeryData) => {
  try {
    const response = await axios.post(API_URL, bakeryData);
    return response.data;
  } catch (error) {
    console.error('빵집 추가 실패:', error);
    throw error;
  }
};

// 빵집 수정 (관리자용)
export const updateBakery = async (id, bakeryData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, bakeryData);
    return response.data;
  } catch (error) {
    console.error('빵집 수정 실패:', error);
    throw error;
  }
};

// 빵집 삭제 (관리자용)
export const deleteBakery = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('빵집 삭제 실패:', error);
    throw error;
  }
};