import axios from "axios";

const API_BASE_URL = "https://provinces.open-api.vn/api";

export const getProvinces = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/p/`);
    return data.map((p) => ({
      value: p.code,
      label: p.name,
    }));
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
};

export const getDistricts = async (provinceCode) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/p/${provinceCode}?depth=2`
    );
    return data.districts.map((d) => ({
      value: d.code,
      label: d.name,
    }));
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};

export const getWards = async (districtCode) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/d/${districtCode}?depth=2`
    );
    return data.wards.map((w) => ({
      value: w.code,
      label: w.name,
    }));
  } catch (error) {
    console.error("Error fetching wards:", error);
    return [];
  }
};
