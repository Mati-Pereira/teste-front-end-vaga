import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout, selectAuth } from "../features/auth.slice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetAllProductsQuery } from "../features/api";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import Pagination from "react-responsive-pagination";
import { products } from "../../db.json";
import NotFound from "../components/NotFound";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { email } = useAppSelector(selectAuth);
  const { data } = useGetAllProductsQuery(
    { page: currentPage },
    { refetchOnMountOrArgChange: true }
  );
  const totalPages = Math.ceil(products.length / 10);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Usuário Deslogado com sucesso");
    navigate("/login");
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <section className="flex items-center justify-center py-20 bg-gray-800">
      <div className="flex flex-col justify-between gap-10 min-h-[600px] ">
        <div className="flex flex-col justify-between gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-center md:text-left text-6xl font-bold text-white">
              Seja Bem Vindo
            </h2>
            <h4 className="text-center md:text-left text-2xl font-bold text-white">
              {email}
            </h4>
          </div>
          <Link to="/new" className="px-10 md:px-0">
            <Button title="Adicionar Produto" />
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-10 md:mx-auto">
            {data?.length
              ? data?.map((product, index) => (
                  <div key={index}>
                    <Link to={`/details/${product.id}`}>
                      <ProductCard
                        id={product.id}
                        data_de_fabricacao={product.data_de_fabricacao}
                        nome={product.nome}
                        preco={product.preco}
                        produto_perecivel={product.produto_perecivel}
                        data_de_validade={product.data_de_validade}
                      />
                    </Link>
                  </div>
                ))
              : null}
          </div>
          {!data?.length ? <NotFound /> : null}
        </div>
        <div className="flex flex-col gap-8 px-10 md:px-0">
          <Button title="Sair" onClick={handleLogout} />
          <Pagination
            current={currentPage}
            total={totalPages}
            onPageChange={handlePageChange}
            className="flex justify-center gap-1 font-medium "
            pageLinkClassName="border-none block h-8 w-8 rounded border border-gray-100 text-center leading-8 text-white hover:bg-blue-600 transition-all"
            activeItemClassName="block h-8 w-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-white"
            srOnlyClassName=""
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
