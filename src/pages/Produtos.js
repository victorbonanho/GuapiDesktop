import React, { useEffect, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import { LuPlus } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  DataGrid,
  Column,
  Paging,
  FilterRow,
  Selection,
  Pager,
  Scrolling,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { app } from "../service/FirebaseConfig";
import { useNavigate } from "react-router-dom";

function Produtos() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const db = getFirestore(app);
  const productsCollectionRef = collection(db, "produtos");

  const handleSelectionChange = ({ selectedRowKeys }) => {
    setSelectedRows(selectedRowKeys);
  };

  const handleEdit = () => {
    if (selectedRows.length === 1) {
      navigate(`/editar/${selectedRows[0]}`);
    } else {
      console.log("Selecione apenas um item para editar");
    }
  };

  const handleAdd = () => {
    navigate("/cadastrar");
  };

  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      const confirmDelete = window.confirm(
        "Tem certeza que deseja deletar os itens selecionados?"
      );
      if (confirmDelete) {
        for (const id of selectedRows) {
          const productDoc = doc(db, "produtos", id);
          await deleteDoc(productDoc);
        }
        await getProducts();
        setSelectedRows([]);
        console.log("Itens deletados:", selectedRows);
      }
    }
  };

  const getProducts = async () => {
    const data = await getDocs(productsCollectionRef);
    const rawData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const formatedData = rawData.map((productsProps) => ({
      id: productsProps.id,
      dataCadastro: productsProps.dataCadastro,
      descricao: productsProps.descricao,
      imagem: productsProps.imagem,
      nome: productsProps.nome,
      quantidade: productsProps.quantidade + " Und.",
      valor: "R$ " + productsProps.valor,
    }));
    setProducts(formatedData);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex justify-center items-center h-[90%] w-full">
      <div className="w-[95%] h-[95%] bg-lightBoxBackground dark:bg-darkBoxBackground rounded-xl">
        <div className="flex p-7 w-full h-full flex-col gap-5">
          <div className="flex gap-4">
            <div
              className={`bg-purple p-2 rounded cursor-pointer ${
                selectedRows.length !== 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleEdit}
            >
              <HiOutlinePencil className="h-5 w-5 text-lightBoxBackground" />
            </div>
            <div
              className="border-2 border-purple p-2 rounded cursor-pointer"
              onClick={handleAdd}
            >
              <LuPlus className="h-5 w-5 text-purple" />
            </div>
            <div
              className={`bg-red p-2 rounded cursor-pointer ${
                selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleDelete}
            >
              <FaRegTrashAlt className="h-5 w-5 text-lightBoxBackground" />
            </div>
          </div>
          <div>
            <p className="text-darkBoxBackground dark:text-lightBoxBackground font-semibold">
              Clique no cabeçalho de uma coluna para agrupar por essa coluna
            </p>
          </div>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <DataGrid
              dataSource={products}
              keyExpr="id"
              showColumnLines={false}
              showRowLines={false}
              showBorders={false}
              onSelectionChanged={handleSelectionChange}
              height={500}
              noDataText="Nenhum produto cadastrado"
            >
              <Scrolling rowRenderingMode="virtual"></Scrolling>
              <Paging defaultPageSize={7} />
              <Pager
                visible={true}
                allowedPageSizes={[10, 20, 30]}
                displayMode="full"
                showPageSizeSelector={true}
                showInfo={true}
                showNavigationButtons={true}
                infoText="Página {0} de {1} ({2} items)"
              />
              <Selection mode="multiple" />
              <FilterRow visible={true} />
              <Column
                dataField="imagem"
                caption="Imagem"
                cellRender={(cellData) => (
                  <img
                    src={cellData.value}
                    alt={cellData.data.nome}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
                headerCellRender={() => (
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-bold text-lightBoxBackground">
                      IMAGEM
                    </span>
                  </div>
                )}
              />
              <Column
                dataField="nome"
                caption="Nome do Produto"
                headerCellRender={() => (
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-bold text-lightBoxBackground">
                      NOME DO PRODUTO
                    </span>
                  </div>
                )}
              />
              <Column
                dataField="descricao"
                caption="Descrição"
                width={300}
                headerCellRender={() => (
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-bold text-lightBoxBackground">
                      DESCRIÇÃO
                    </span>
                  </div>
                )}
              />
              <Column
                dataField="valor"
                caption="Valor"
                headerCellRender={() => (
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-bold text-lightBoxBackground">
                      VALOR
                    </span>
                  </div>
                )}
              />
              <Column
                dataField="quantidade"
                caption="Quantidade"
                headerCellRender={() => (
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-bold text-lightBoxBackground">
                      QUANTIDADE
                    </span>
                  </div>
                )}
              />
              <Column
                dataField="dataCadastro"
                caption="Data de Cadastro"
                dataType="date"
                headerCellRender={() => (
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-bold text-lightBoxBackground">
                      DATA DE CADASTRO
                    </span>
                  </div>
                )}
              />
            </DataGrid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Produtos;
