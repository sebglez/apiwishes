const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wishes");
  console.log("Conexión establecida");
}

const wishSchema = new mongoose.Schema({
  name: String,
  checked: Boolean,
});

const Wish = mongoose.model("Wish", wishSchema);

app.get("/wish", async (req, res) => {
  try {
    const wishList = await Wish.find();
    res.status(200).json(wishList);
  } catch (error) {
    res.status(500).send("Error al obtener la lista");
  }
});

app.post("/wish", async (req, res) => {
  try {
    const newWish = await Wish.create(req.body);
    const wishList = await Wish.find();
    res.status(201).json(wishList);
  } catch (error) {
    res.status(500).send("Error al crear un nuevo deseo");
  }
});

app.patch("/wish/:wishId", async (req, res) => {
  const updateById = req.params.wishId;
  const updatedFields = req.body;

  try {
    const updateWish = await Wish.findByIdAndUpdate(updateById, updatedFields, {
      new: true,
    });
    // { new: true } se utiliza para devolver el documento actualizado.

    if (!updateWish) {
      return res.status(404).json({ message: "Deseo no encontrado" });
    }

    res.status(200).json(updateWish);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el deseo");
  }
});

app.delete("/wish/:wishId", async (req, res) => {
  const wishId = req.params.wishId;

  try {
    const deletedWish = await Wish.findByIdAndDelete(wishId);

    if (!deletedWish) {
      return res.status(404).send("No se encontró el deseo para eliminar");
    }

    const wishList = await Wish.find();
    res.status(201).json(wishList);
  } catch (error) {
    res.status(500).send("Error al eliminar el deseo");
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en el puerto 3001");
});
