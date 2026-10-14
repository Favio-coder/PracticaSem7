export const performanceProducts = Array.from({ length: 1000 }, (_, index) => {
  const id = index + 1;

  return {
    id,
    title: `Producto de prueba ${String(id).padStart(4, "0")}`,
    category: ["Tecnologia", "Audio", "Accesorios", "Hogar"][index % 4],
    price: ((id * 37) % 950) + 10,
  };
});
