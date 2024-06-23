import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { app, storage } from "../service/FirebaseConfig";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProduct() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productDoc = await getDoc(doc(productsCollectionRef, id));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          setFormData({
            productImage: null,
            productName: productData.nome || "",
            productDescription: productData.descricao || "",
            productPrice: productData.valor || "",
            productQuantity: productData.quantidade || "",
          });
          setImagePreview(productData.imagem || null);
        } else {
          toast.error("Produto não encontrado.");
          navigate("/produtos");
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados do produto.");
      }
    };

    console.log("Caiu aqui");

    fetchProductData();
  }, []);

  const handleBack = () => {
    navigate("/produtos");
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const selectedFile = files[0];
      setFormData((prevState) => ({
        ...prevState,
        productImage: selectedFile,
      }));

      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      productImage,
      productName,
      productDescription,
      productPrice,
      productQuantity,
    } = formData;

    const updateProductData = async (downloadURL = imagePreview) => {
      try {
        await updateDoc(doc(productsCollectionRef, id), {
          imagem: downloadURL,
          nome: productName,
          descricao: productDescription,
          valor: productPrice,
          quantidade: productQuantity,
        });
        toast.success("Produto atualizado com sucesso!");
        setFormData({
          productImage: null,
          productName: "",
          productDescription: "",
          productPrice: "",
          productQuantity: "",
        });
        setImagePreview(null);
        navigate("/produtos");
      } catch (error) {
        toast.error("Erro ao atualizar o produto.");
      }
    };

    if (productImage) {
      const storageRef = ref(storage, `images/${productImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, productImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (error) => {
          toast.error("Erro ao fazer upload da imagem.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateProductData(downloadURL);
          });
        }
      );
    } else {
      updateProductData();
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 h-auto w-full">
      <ToastContainer />
      <div className="w-[95%] h-[95%] bg-lightBoxBackground dark:bg-darkBoxBackground rounded-xl">
        <div className="flex w-full h-full flex-col gap-5">
          <h2 className="p-7 border-b-2 text-xl font-semibold text-darkBoxBackground dark:text-lightBoxBackground">
            Editar Produto
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

export default EditProduct;
