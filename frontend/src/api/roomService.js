const API_URL = "http://localhost:5001/api/rooms"; // ganti sesuai port backend kamu

export const getRooms = async () => {
  const res = await fetch(API_URL);
  return res.json();
};
export const createRoom = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateRoom = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteRoom = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
