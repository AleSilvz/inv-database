import { useEffect, useState } from "react";
import "./App.css";
import { db } from "./utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

function App() {
  const [produto, setProduto] = useState("");
  const [codigo, setCodigo] = useState("");
  const [dados, setDados] = useState([]);
  const [edit, setEdit] = useState(false);
  const [codeProduct, setCodeProduct] = useState("");
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");

  const hanlderInputText = (text) => {
    const format = text.toUpperCase();
    setProduto(format);
  };

  useEffect(() => {
    const docRef = collection(db, "inv");

    const unsubscribe = onSnapshot(docRef, (itens) => {
      const e = itens.docs.map((item) => ({
        product: item.data().product,
        code: item.data().code,
        type: item.data().type,
      }));
      setDados(e);
      // console.log(e);
    });

    return () => unsubscribe();
  }, []);

  function validation() {
    const errs = {};
    if (!codigo) errs.code = "Digite o codigo do Produto!";
    if (!produto) errs.product = "Digite o nome do Produto!";
    if (!tipo) errs.type = "Selecione o tipo!";

    if (Object.keys(errs).length > 0) {
      alert(Object.values(errs).join("\n"));
      return false;
    }

    return true;
  }

  const handlerAddProduct = async () => {
    try {
      const validacao = validation();

      if (!validacao) return;

      const docRef = collection(db, "inv");

      const q = query(docRef, where("code", "==", codigo));

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const details = snapshot.docs[0].data().product;
        return alert(`Produto com o código ${codigo}\n${details} cadastrado!`);
      } else {
        await addDoc(docRef, {
          code: codigo,
          product: produto,
          type: tipo,
        });

        alert("Produto cadastrado!");
      }

      setCodigo("");
      setProduto("");
      setTipo("");
      console.log("Produto:", produto, "Código:", codigo);
    } catch (error) {
      throw error;
    }
  };

  const produtosFiltrados = dados.filter((item) =>
    String(item.code).includes(search)
  );

  async function deleterProduct(product, code) {
    try {
      const docAll = collection(db, "inv");
      const q = query(docAll, where("code", "==", code));

      const allDados = await getDocs(q);
      const id = allDados.docs[0].id;

      const docDelete = doc(db, "inv", id);
      if (confirm(`Deseja excluir ${product}?`)) {
        await deleteDoc(docDelete);

        setSearch("");

        return alert("Produto excluido do banco de dados!");
      }
    } catch (error) {
      throw error;
    }
  }

  async function editProduct(product, code) {
    try {
      setCodeProduct(code);
      setEdit(true);
      setProduto(product);
      setCodigo(code);
    } catch (error) {
      throw error;
    }
  }

  async function alteracao() {
    try {
      const validacao = validation();

      if (!validacao) return;

      const docAll = collection(db, "inv");
      const q = query(docAll, where("code", "==", codeProduct));

      const allDados = await getDocs(q);
      const id = allDados.docs[0].id;

      const docEdit = doc(db, "inv", id);

      await updateDoc(docEdit, {
        code: codigo,
        product: produto,
        type: tipo,
      });

      setProduto("");
      setCodigo("");
      setCodeProduct("");
      setSearch("");
      setTipo("");
      setEdit(false);
      alert("Produto editado com sucesso!");
    } catch (error) {
      throw error;
    }
  }

  const arr = produtosFiltrados ? produtosFiltrados : dados;

  return (
    <>
      <div className="container">
        <div className="header">
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "center",
              gap: 15,
            }}
          >
            <h2 style={{ fontWeight: "100" }}>Database</h2>
            <input
              type="number"
              className="input-search"
              placeholder="Pesquisa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <h2>Produtos: {dados.length}</h2>
          </div>
          <h2>INV</h2>
        </div>

        {!edit ? (
          <div className="content">
            <input
              type="number"
              className="input"
              placeholder="Código..."
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <input
              type="text"
              className="input p"
              placeholder="Produto..."
              value={produto}
              onChange={(e) => hanlderInputText(e.target.value)}
            />
            <select
              name="tipo"
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">TIPO</option>
              <option value="KG">KG</option>
              <option value="UND">UND</option>
            </select>
            <button className="button" onClick={handlerAddProduct}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <div className="front">
                <span>adicionar</span>
                <svg fill="currentColor" viewBox="0 0 20 20" className="arrow">
                  <path
                    clipRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
        ) : (
          <div className="content">
            <input
              type="number"
              className="input"
              placeholder="Código..."
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <input
              type="text"
              className="input p"
              placeholder="Produto..."
              value={produto}
              onChange={(e) => hanlderInputText(e.target.value)}
            />
            <select
              name="tipo"
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">TIPO</option>
              <option value="KG">KG</option>
              <option value="UND">UND</option>
            </select>

            <button className="button" onClick={alteracao}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <div className="front">
                <span>editar</span>
                <svg fill="currentColor" viewBox="0 0 20 20" className="arrow">
                  <path
                    clipRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
        )}

        <div className="scroll">
          <table className="table">
            <thead>
              <tr>
                <th>codigo</th>
                <th>produto</th>
                <th>tipo</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {arr.map((item, index) => (
                <tr className="tr" key={index}>
                  <td className="td">{item.code}</td>
                  <td className="td">{item.product}</td>
                  <td>{item.type}</td>
                  <td style={{ justifyContent: "space-evenly" }}>
                    <ion-icon
                      onClick={() => editProduct(item.product, item.code)}
                      name="pencil-outline"
                    />
                  </td>
                  <td>
                    <ion-icon
                      onClick={() => deleterProduct(item.product, item.code)}
                      name="trash-outline"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
