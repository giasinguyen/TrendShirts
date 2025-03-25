import React from "react";
import { Badge } from "../../components/ui/badge";

export const Cover = (): JSX.Element => {
  // Define page types for mapping
  const pageTypes = [
    { id: 1, name: "Homepage", position: { top: "281px", left: "349px" } },
    {
      id: 2,
      name: "Product Detail Page",
      position: { top: "281px", left: "567px" },
    },
    { id: 3, name: "Category Page", position: { top: "281px", left: "881px" } },
    { id: 4, name: "Cart", position: { top: "281px", left: "1141px" } },
    {
      id: 5,
      name: "Mobile Responsive",
      position: { top: "281px", left: "1287px" },
    },
  ];

  return (
    <section className="bg-[#ececec] flex flex-row justify-center w-full">
      <div className="bg-[#ececec] w-[1920px] h-[960px]">
        <div className="relative h-[960px]">
          <img
            className="absolute w-[722px] h-[960px] top-0 left-0 object-cover"
            alt="Category page"
            src="/category-page-1.png"
          />

          <img
            className="absolute w-[655px] h-[655px] top-[305px] left-[1265px] object-cover"
            alt="Product detail page"
            src="/product-detail-page--5--1.png"
          />

          <h1 className="absolute w-[1072px] h-[129px] top-[87px] left-[424px] [font-family:'Integral_CF-Bold',Helvetica] font-bold text-black text-[76px] text-center tracking-[0] leading-[76px]">
            E-commerce Website Template (FREEBIE)
          </h1>

          {pageTypes.map((page) => (
            <Badge
              key={page.id}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-5 absolute bg-[#0000001a] rounded-[60px] hover:bg-[#00000030]"
              style={{ top: page.position.top, left: page.position.left }}
              variant="outline"
            >
              <img className="w-6 h-6" alt="Frame" src="/frame.svg" />
              <span className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-black text-2xl text-center tracking-[0] leading-[34px] whitespace-nowrap">
                {page.name}
              </span>
            </Badge>
          ))}

          <img
            className="absolute w-[1024px] h-[960px] top-0 left-[509px] object-cover"
            alt="Homepage"
            src="/homepage-1.png"
          />

          <img
            className="absolute w-[338px] h-[442px] top-[518px] left-0 object-cover"
            alt="Cart"
            src="/cart--1--1.png"
          />
        </div>
      </div>
    </section>
  );
};
