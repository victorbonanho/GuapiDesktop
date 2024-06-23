import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { app, storage } from "../service/FirebaseConfig";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterProduct() {
  const [formData, setFormData] = useState({
    productImage: null,
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const db = getFirestore(app);
  const productsCollectionRef = collection(db, "produtos");

  const handleBack = () => {
    setFormData({
      productImage: null,
      productName: "",
      productDescription: "",
      productPrice: "",
      productQuantity: "",
    });
    setImagePreview(null);
    navigate("/produtos");
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = formData.productImage;
    if (!file) return;
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        toast.error("Erro ao fazer upload da imagem.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const dataCadastro = new Date().toLocaleDateString("pt-BR");
          try {
            await addDoc(productsCollectionRef, {
              imagem: downloadURL,
              nome: formData.productName,
              descricao: formData.productDescription,
              valor: formData.productPrice,
              quantidade: formData.productQuantity,
              dataCadastro: dataCadastro,
            });
            toast.success("Produto registrado com sucesso!");
            setFormData({
              productImage: null,
              productName: "",
              productDescription: "",
              productPrice: "",
              productQuantity: "",
            });
            setImagePreview(null);
          } catch (error) {
            toast.error("Erro ao registrar o produto.");
          }
        });
      }
    );
  };

  return (
    <div className="flex justify-center items-center mt-10 h-auto w-full">
      <ToastContainer />
      <div className="w-[95%] h-[95%] bg-lightBoxBackground dark:bg-darkBoxBackground rounded-xl">
        <div className="flex w-full h-full flex-col gap-5">
          <h2 className="p-7 border-b-2 text-xl font-semibold text-darkBoxBackground dark:text-lightBoxBackground">
            Cadastrar Produto
          </h2>
          <form
            onSubmit={handleSubmit}
            className="text-gray-400 dark:text-gray-50"
          >
            <div className="flex px-7">
              <div className="mr-7">
                <label htmlFor="productImage">Foto do Produto</label>
                <div className="flex flex-col mt-2">
                  <div className="w-60 h-60 flex items-center justify-center bg-gray-100 rounded-lg">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <span></span>
                    )}
                  </div>
                  <input
                    type="file"
                    id="productImage"
                    name="productImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="productImage"
                    className="cursor-pointer py-2 px-4 bg-purple text-white rounded"
                  >
                    Selecione um arquivo
                  </label>
                </div>
              </div>
              <div className="flex flex-col justify-between w-full">
                <div className="flex flex-col">
                  <label htmlFor="productName">Nome do Produto</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    className="border-2 rounded p-2 mt-2 h-12 text-xl bg-lightBoxBackground dark:bg-darkBoxBackground text-darkBoxBackground dark:text-lightBoxBackground"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="productDescription">Observações</label>
                  <textarea
                    type="text"
                    id="productDescription"
                    name="productDescription"
                    className="flex items-start border-2 rounded p-2 mt-2 text-xl bg-lightBoxBackground dark:bg-darkBoxBackground text-darkBoxBackground dark:text-lightBoxBackground"
                    value={formData.productDescription}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="flex flex-row justify-between w-full gap-10">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="productPrice">Valor</label>
                    <input
                      type="number"
                      id="productPrice"
                      name="productPrice"
                      className="border-2 rounded p-2 mt-2 h-12 text-xl bg-lightBoxBackground dark:bg-darkBoxBackground text-darkBoxBackground dark:text-lightBoxBackground"
                      placeholder="R$"
                      value={formData.productPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="productQuantity">Quantidade</label>
                    <input
                      type="number"
                      id="productQuantity"
                      name="productQuantity"
                      className="border-2 rounded p-2 mt-2 h-12 text-xl bg-lightBoxBackground dark:bg-darkBoxBackground text-darkBoxBackground dark:text-lightBoxBackground"
                      placeholder="00"
                      value={formData.productQuantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 border-t-2 mt-8 justify-end">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white py-2 px-8 rounded my-5"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="bg-purple text-white py-2 px-8 rounded my-5 mr-7"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterProduct;
