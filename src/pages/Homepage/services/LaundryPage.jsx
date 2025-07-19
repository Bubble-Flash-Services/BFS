import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../components/CartContext';

const clothingItems = {
  men: [
    {
      id: 1,
      name: 'Bottom Wear',
      image: '/laundry/wash & fold/bottom wear.jpg',
      price: 25,
      description: 'Jeans, trousers, formal pants'
    },
    {
      id: 2,
      name: 'Top Wear',
      image: '/laundry/wash & fold/top waer.jpg',
      price: 20,
      description: 'Shirts, t-shirts, polo shirts'
    },
    {
      id: 3,
      name: 'Bottom Wear Half',
      image: '/laundry/wash & fold/bottom wear half.jpg',
      price: 15,
      description: 'Undergarments, shorts'
    },
    {
      id: 4,
      name: 'Casual Jacket',
      image: '/laundry/wash & fold/casual jacket.jpg',
      price: 40,
      description: 'Hoodies, light jackets'
    },
  ],
  women: [
    {
      id: 5,
      name: 'Bottom Wear',
      image: '/laundry/wash & fold/bottom wear women.jpg',
      price: 25,
      description: 'Jeans, trousers, skirts'
    },
    {
      id: 6,
      name: 'Top Wear',
      image: '/laundry/wash & fold/top wear women.jpg',
      price: 20,
      description: 'Blouses, tops, kurtas'
    },
    {
      id: 7,
      name: 'Bottom Wear Half',
      image: '/laundry/wash & fold/bottom wear half women.jpg',
      price: 15,
      description: 'Undergarments, shorts'
    },
    {
      id: 8,
      name: 'Casual Jacket',
      image: '/laundry/wash & fold/casual jacket women.jpg',
      price: 40,
      description: 'Cardigans, light jackets'
    },
  ],
  homeLinen: [
    {
      id: 9,
      name: 'Curtain Thin',
      image: '/laundry/wash & fold/curtain thin.jpg',
      price: 35,
      description: 'Light curtains, sheers'
    },
    {
      id: 10,
      name: 'Towel',
      image: '/laundry/wash & fold/towel.jpg',
      price: 20,
      description: 'Bath towels, hand towels'
    },
    {
      id: 11,
      name: 'Big Table Cloth',
      image: '/laundry/wash & fold/big table cloth.webp',
      price: 50,
      description: 'Large table covers'
    },
    {
      id: 12,
      name: 'Pillow Cover',
      image: '/laundry/wash & fold/pillow cover.jpg',
      price: 15,
      description: 'Cushion covers, pillow cases'
    },
    {
      id: 13,
      name: 'Small Table Cloth',
      image: '/laundry/wash & fold/small table cloth.avif',
      price: 25,
      description: 'Small table covers'
    },
  ],
  accessories: [
    {
      id: 14,
      name: 'Socks',
      image: '/laundry/wash & fold/socks.jpg',
      price: 10,
      description: 'All types of socks'
    },
    {
      id: 15,
      name: 'Apron',
      image: '/laundry/wash & fold/apron.jpg',
      price: 30,
      description: 'Kitchen aprons'
    },
    {
      id: 16,
      name: 'Handkerchief',
      image: '/laundry/wash & fold/handkerchief.jpg',
      price: 8,
      description: 'Cloth handkerchiefs'
    },
    {
      id: 17,
      name: 'Undergarment',
      image: '/laundry/wash & fold/undergarment.webp',
      price: 15,
      description: 'Inner wear items'
    },
    {
      id: 18,
      name: 'Bath Robe',
      image: '/laundry/wash & fold/bath robe.jpg',
      price: 60,
      description: 'Terry cloth robes'
    },
  ],
  winterWear: [
    {
      id: 19,
      name: 'Sweatshirt/Hoodie',
      image: '/laundry/wash & fold/sweatshirthoodie.jpg',
      price: 50,
      description: 'Heavy sweatshirts, hoodies'
    },
    {
      id: 20,
      name: 'Sweater',
      image: '/laundry/wash & fold/sweater.jpg',
      price: 45,
      description: 'Woolen sweaters'
    },
    {
      id: 21,
      name: 'Shawl',
      image: '/laundry/wash & fold/shawl.jpg',
      price: 40,
      description: 'Woolen shawls, stoles'
    },
    {
      id: 22,
      name: 'Scarf/Muffler',
      image: '/laundry/wash & fold/scarf.jpg',
      price: 25,
      description: 'Winter scarfs, mufflers'
    },
  ],
  kids: [
    {
      id: 23,
      name: 'Kids Woollenwear Bottom',
      image: '/laundry/wash & fold/kids wollenwear.jpg',
      price: 30,
      description: 'Kids woolen pants'
    },
    {
      id: 24,
      name: 'Kids Bottomwear',
      image: '/laundry/wash & fold/kids bottomwear.jpg',
      price: 20,
      description: 'Kids shorts, pants'
    },
    {
      id: 25,
      name: 'Kids Jacket',
      image: '/laundry/wash & fold/kids jacket.webp',
      price: 35,
      description: 'Kids jackets, hoodies'
    },
    {
      id: 26,
      name: 'Kids Topwear',
      image: '/laundry/wash & fold/kids top wear.jpg',
      price: 18,
      description: 'Kids shirts, t-shirts'
    },
    {
      id: 27,
      name: 'Kids Woollenwear Top',
      image: '/laundry/wash & fold/kids wollenwear top.webp',
      price: 32,
      description: 'Kids woolen tops'
    },
  ]
};

const ironingItems = {
  men: [
    {
      id: 201,
      name: 'Top Wear',
      image: '/laundry/ironing/top wear.webp',
      price: 25,
      description: 'Shirts, t-shirts, polo shirts'
    },
    {
      id: 202,
      name: 'Bottom Wear',
      image: '/laundry/ironing/Bottom Wear.webp',
      price: 30,
      description: 'Jeans, trousers, formal pants'
    },
    {
      id: 203,
      name: 'Blazer/Jacket',
      image: '/laundry/ironing/blazer jacket.png',
      price: 60,
      description: 'Formal blazers and jackets'
    },
  ],
  women: [
    {
      id: 101,
      name: 'Bottom Wear',
      image: '/laundry/ironing/bottom wear women.webp',
      price: 30,
      description: 'Jeans, trousers, formal pants'
    },
    {
      id: 102,
      name: 'Top Wear',
      image: '/laundry/ironing/top wear women.webp',
      price: 25,
      description: 'Blouses, shirts, kurtas'
    },
    {
      id: 103,
      name: 'Saree/Lehenga',
      image: '/laundry/ironing/saree lehanga women.webp',
      price: 80,
      description: 'Traditional sarees and lehengas'
    },
    {
      id: 104,
      name: 'Blazer/Jacket',
      image: '/laundry/ironing/blazer jacket women.webp',
      price: 60,
      description: 'Formal blazers and jackets'
    },
  ],
  homeLinen: [
    {
      id: 105,
      name: 'Pillow Cover',
      image: '/laundry/ironing/pilow cover.webp',
      price: 20,
      description: 'Cushion covers, pillow cases'
    },
    {
      id: 106,
      name: 'Curtain Thin',
      image: '/laundry/ironing/curtain thin.webp',
      price: 40,
      description: 'Light curtains, sheers'
    },
    {
      id: 107,
      name: 'Towel',
      image: '/laundry/ironing/towel.webp',
      price: 25,
      description: 'Bath towels, hand towels'
    },
    {
      id: 108,
      name: 'Sofa Cover',
      image: '/laundry/ironing/sofa cover.webp',
      price: 70,
      description: 'Sofa and furniture covers'
    },
  ],
  accessories: [
    {
      id: 109,
      name: 'Handkerchief',
      image: '/laundry/ironing/handerkerchief.jpg',
      price: 12,
      description: 'Cloth handkerchiefs'
    },
    {
      id: 110,
      name: 'Bath Robe',
      image: '/laundry/ironing/bath robe.jpg',
      price: 65,
      description: 'Terry cloth robes'
    },
    {
      id: 111,
      name: 'Apron',
      image: '/laundry/ironing/apron.jpg',
      price: 35,
      description: 'Kitchen aprons'
    },
    {
      id: 112,
      name: 'Socks',
      image: '/laundry/ironing/socks.jpg',
      price: 15,
      description: 'All types of socks'
    },
    {
      id: 113,
      name: 'Undergarment',
      image: '/laundry/ironing/undergarment.webp',
      price: 18,
      description: 'Inner wear items'
    },
  ],
  winterWear: [
    {
      id: 114,
      name: 'Shawl',
      image: '/laundry/ironing/shawl.webp',
      price: 45,
      description: 'Woolen shawls, stoles'
    },
    {
      id: 115,
      name: 'Sweater',
      image: '/laundry/ironing/sweater.jpg',
      price: 50,
      description: 'Woolen sweaters'
    },
    {
      id: 116,
      name: 'Sweatshirt/Hoodie',
      image: '/laundry/ironing/sweatshirt hoodie.jpg',
      price: 55,
      description: 'Heavy sweatshirts, hoodies'
    },
    {
      id: 117,
      name: 'Scarf/Muffler',
      image: '/laundry/ironing/scurf muffler.jpg',
      price: 30,
      description: 'Winter scarfs, mufflers'
    },
  ],
  kids: [
    {
      id: 118,
      name: 'Kids Topwear',
      image: '/laundry/ironing/kids topwear.jpg',
      price: 22,
      description: 'Kids shirts, t-shirts'
    },
    {
      id: 119,
      name: 'Kids Bottomwear',
      image: '/laundry/ironing/kids bottomwear.jpg',
      price: 25,
      description: 'Kids shorts, pants'
    },
    {
      id: 120,
      name: 'Kids Jacket',
      image: '/laundry/ironing/kids jacket.webp',
      price: 40,
      description: 'Kids jackets, hoodies'
    },
    {
      id: 121,
      name: 'Kids Woollenwear Top',
      image: '/laundry/ironing/kids wollen top.webp',
      price: 35,
      description: 'Kids woolen tops'
    },
    {
      id: 122,
      name: 'Kids Woollenwear Bottom',
      image: '/laundry/ironing/kids wollenwear bottom.jpg',
      price: 35,
      description: 'Kids woolen pants'
    },
  ]
};

const dryCleanItems = {
  men: [
    {
      id: 301,
      name: 'Tshirt',
      image: '/laundry/dry clean/tshirt.webp',
      price: 45,
      description: 'Regular t-shirts'
    },
    {
      id: 302,
      name: 'Trousers/Pants Normal',
      image: '/laundry/dry clean/trousers pants normal.webp',
      price: 65,
      description: 'Regular trousers and pants'
    },
    {
      id: 303,
      name: 'Trousers/Pants Silk',
      image: '/laundry/dry clean/trousers pants silk.jpg',
      price: 85,
      description: 'Silk trousers and pants'
    },
    {
      id: 304,
      name: 'Casual Jacket Half',
      image: '/laundry/dry clean/casual jacket half.jpg',
      price: 120,
      description: 'Half-length casual jackets'
    },
    {
      id: 305,
      name: 'Casual Jacket Full',
      image: '/laundry/dry clean/causual jacket.jpg',
      price: 150,
      description: 'Full-length casual jackets'
    },
    {
      id: 306,
      name: 'Casual Jacket Leather',
      image: '/laundry/dry clean/casual jacket leather.jpg',
      price: 200,
      description: 'Leather jackets'
    },
    {
      id: 307,
      name: 'Ethnic Jacket Top',
      image: '/laundry/dry clean/ethnic jacket top.jpg',
      price: 140,
      description: 'Traditional ethnic jackets'
    },
    {
      id: 308,
      name: 'Sherwani Top',
      image: '/laundry/dry clean/sherwani top.jpg',
      price: 180,
      description: 'Traditional sherwani tops'
    },
    {
      id: 309,
      name: 'Shorts',
      image: '/laundry/dry clean/shorts.jpg',
      price: 50,
      description: 'All types of shorts'
    },
    {
      id: 310,
      name: 'Blazer/Suit 1 Piece',
      image: '/laundry/dry clean/blazer suit 1 piece.png',
      price: 160,
      description: 'Single piece blazer'
    },
    {
      id: 311,
      name: 'Blazer/Suit 2 Piece',
      image: '/laundry/dry clean/blazer suit 2 piece.jpg',
      price: 280,
      description: 'Two piece suit'
    },
    {
      id: 312,
      name: 'Kurta Silk',
      image: '/laundry/dry clean/kurta silk.jpg',
      price: 90,
      description: 'Silk kurtas'
    },
    {
      id: 313,
      name: 'Shirt Silk/Designer',
      image: '/laundry/dry clean/shirt silk designer.jpg',
      price: 75,
      description: 'Silk and designer shirts'
    },
    {
      id: 314,
      name: 'Shirt Normal',
      image: '/laundry/dry clean/shirt normal.jpg',
      price: 55,
      description: 'Regular cotton shirts'
    },
    {
      id: 315,
      name: 'Kurta Normal/Cotton',
      image: '/laundry/dry clean/kurta normal cotton.jpg',
      price: 70,
      description: 'Cotton kurtas'
    },
    {
      id: 316,
      name: 'Blazer/Suit 3 Piece',
      image: '/laundry/dry clean/blazer suit 3 piece.jpg',
      price: 380,
      description: 'Three piece suit'
    },
    {
      id: 317,
      name: 'Pathani Suit Top',
      image: '/laundry/dry clean/pathani suit top.jpg',
      price: 85,
      description: 'Pathani suit tops'
    },
    {
      id: 318,
      name: 'Tracksuit Jacket',
      image: '/laundry/dry clean/tracksuit jacket.jpg',
      price: 80,
      description: 'Sports tracksuit jackets'
    },
    {
      id: 319,
      name: 'Jeans',
      image: '/laundry/dry clean/jeans.webp',
      price: 70,
      description: 'Denim jeans'
    },
    {
      id: 320,
      name: 'Dhoti/Lungi',
      image: '/laundry/dry clean/dhoti lungi.jpg',
      price: 60,
      description: 'Traditional dhoti and lungi'
    },
  ],
  women: [
    {
      id: 401,
      name: 'Shirt Silk/Designer',
      image: '/laundry/dry clean/shirt silk designer women.webp',
      price: 75,
      description: 'Silk and designer shirts'
    },
    {
      id: 402,
      name: 'Jeans',
      image: '/laundry/dry clean/jeans women.jpg',
      price: 70,
      description: 'Denim jeans'
    },
    {
      id: 403,
      name: 'Blazer/Suit 1 Piece',
      image: '/laundry/dry clean/Blazer Suit 1 Piece women.webp',
      price: 160,
      description: 'Single piece blazer'
    },
    {
      id: 404,
      name: 'Shorts',
      image: '/laundry/dry clean/shorts women.jpg',
      price: 50,
      description: 'All types of shorts'
    },
    {
      id: 405,
      name: 'Top/Tshirt',
      image: '/laundry/dry clean/tshirt.webp',
      price: 45,
      description: 'Tops and t-shirts'
    },
    {
      id: 406,
      name: 'Saree Plain',
      image: '/laundry/dry clean/saree plain.jpg',
      price: 120,
      description: 'Plain sarees'
    },
    {
      id: 407,
      name: 'Saree Designer',
      image: '/laundry/dry clean/saree designer.jpg',
      price: 180,
      description: 'Designer sarees'
    },
    {
      id: 408,
      name: 'Saree Silk',
      image: '/laundry/dry clean/saree silk.jpg',
      price: 200,
      description: 'Pure silk sarees'
    },
    {
      id: 409,
      name: 'Saree Designer Heavy',
      image: '/laundry/dry clean/saree designer heavy.jpg',
      price: 300,
      description: 'Heavy designer sarees'
    },
    {
      id: 410,
      name: 'Blouse Normal/Cotton',
      image: '/laundry/dry clean/blouse normal cotton.jpg',
      price: 55,
      description: 'Cotton blouses'
    },
    {
      id: 411,
      name: 'Blouse Heavy Work',
      image: '/laundry/dry clean/blouse heavy work.jpg',
      price: 90,
      description: 'Heavy work blouses'
    },
    {
      id: 412,
      name: 'Petticoat/Shapewear',
      image: '/laundry/dry clean/petticoat.webp',
      price: 45,
      description: 'Petticoats and shapewear'
    },
    {
      id: 413,
      name: 'Frock',
      image: '/laundry/dry clean/frock.jpg',
      price: 80,
      description: 'Traditional frocks'
    },
    {
      id: 414,
      name: 'Kameez/Kurti Heavy Work',
      image: '/laundry/dry clean/kamezz.jpg',
      price: 95,
      description: 'Heavy work kameez/kurti'
    },
    {
      id: 415,
      name: 'Kameez/Kurti Normal',
      image: '/laundry/dry clean/kameez kurti normal.jpg',
      price: 65,
      description: 'Regular kameez/kurti'
    },
    {
      id: 416,
      name: 'Skirt Normal',
      image: '/laundry/dry clean/skirt normal.jpg',
      price: 60,
      description: 'Regular skirts'
    },
    {
      id: 417,
      name: 'Skirt Silk/Designer',
      image: '/laundry/dry clean/skirt silk designer.jpg',
      price: 85,
      description: 'Silk and designer skirts'
    },
    {
      id: 418,
      name: 'Lehenga Cotton',
      image: '/laundry/dry clean/lehanga cotton.jpg',
      price: 200,
      description: 'Cotton lehengas'
    },
    {
      id: 419,
      name: 'Lehenga High Work',
      image: '/laundry/dry clean/lehanga high work.webp',
      price: 400,
      description: 'High work lehengas'
    },
    {
      id: 420,
      name: 'Lehenga/Ghaagra Silk',
      image: '/laundry/dry clean/lehanga ghagra silk.jpg',
      price: 350,
      description: 'Silk lehengas and ghagras'
    },
    {
      id: 421,
      name: 'Shirt Normal',
      image: '/laundry/dry clean/shirt normal women.webp',
      price: 55,
      description: 'Regular cotton shirts'
    },
    {
      id: 422,
      name: 'Blazer/Suit 3 Piece',
      image: '/laundry/dry clean/blazer suit 3 piece women.jpg',
      price: 380,
      description: 'Three piece suit'
    },
    {
      id: 423,
      name: 'Blazer/Suit 2 Piece',
      image: '/laundry/dry clean/blazer suit 2 piece women.jpg',
      price: 280,
      description: 'Two piece suit'
    },
    {
      id: 424,
      name: 'Leggings',
      image: '/laundry/dry clean/leggings.jpg',
      price: 40,
      description: 'All types of leggings'
    },
    {
      id: 425,
      name: 'Pants',
      image: '/laundry/dry clean/pants.jpg',
      price: 65,
      description: 'Regular pants'
    },
    {
      id: 426,
      name: 'Pyjama (Normal)',
      image: '/laundry/dry clean/pyjama.jpg',
      price: 50,
      description: 'Regular pyjamas'
    },
    {
      id: 427,
      name: 'Pyjama (Silk)',
      image: '/laundry/dry clean/pyjama silk.jpg',
      price: 70,
      description: 'Silk pyjamas'
    },
    {
      id: 428,
      name: 'Salwaar Normal',
      image: '/laundry/dry clean/salwaar normal.jpg',
      price: 60,
      description: 'Regular salwar'
    },
    {
      id: 429,
      name: 'Salwaar Slik',
      image: '/laundry/dry clean/salwaar silk.jpg',
      price: 80,
      description: 'Silk salwar'
    },
    {
      id: 430,
      name: 'Dupatta Normal',
      image: '/laundry/dry clean/dupatta normal.jpg',
      price: 50,
      description: 'Regular dupatta'
    },
    {
      id: 431,
      name: 'Dupatta Silk',
      image: '/laundry/dry clean/dupatta silk.jpg',
      price: 75,
      description: 'Silk dupatta'
    },
    {
      id: 432,
      name: 'Dupatta Heavy Work',
      image: '/laundry/dry clean/dupatta heavy work.jpg',
      price: 120,
      description: 'Heavy work dupatta'
    },
    {
      id: 433,
      name: 'Tracksuit Jacket',
      image: '/laundry/dry clean/tracksuit jacket women.jpg',
      price: 80,
      description: 'Sports tracksuit jackets'
    },
    {
      id: 434,
      name: 'Lehenga Low Work',
      image: '/laundry/dry clean/lehenga low work.webp',
      price: 250,
      description: 'Low work lehengas'
    },
    {
      id: 435,
      name: 'Gown Medium Work',
      image: '/laundry/dry clean/gown medium work.jpg',
      price: 180,
      description: 'Medium work gowns'
    },
    {
      id: 436,
      name: 'Gown Heavy Work',
      image: '/laundry/dry clean/gown heavy work.jpg',
      price: 250,
      description: 'Heavy work gowns'
    },
    {
      id: 437,
      name: 'Wedding Gown Normal',
      image: '/laundry/dry clean/Wedding Gown Normal.jpg',
      price: 300,
      description: 'Regular wedding gowns'
    },
    {
      id: 438,
      name: 'Wedding Gown Heavy',
      image: '/laundry/dry clean/Wedding Gown Heavy.jpg',
      price: 500,
      description: 'Heavy wedding gowns'
    },
    {
      id: 439,
      name: 'Maxi',
      image: '/laundry/dry clean/maxi.jpg',
      price: 70,
      description: 'Maxi dresses'
    },
    {
      id: 440,
      name: 'Jumpsuit',
      image: '/laundry/dry clean/Jumpsuit.jpg',
      price: 90,
      description: 'All types of jumpsuits'
    },
    {
      id: 441,
      name: 'Trousers/Pants Normal',
      image: '/laundry/dry clean/Trousers Pants Normal women.jpg',
      price: 65,
      description: 'Regular trousers and pants'
    },
    {
      id: 442,
      name: 'Trousers/Pants Silk',
      image: '/laundry/dry clean/Trousers Pants Silk women.jpg',
      price: 85,
      description: 'Silk trousers and pants'
    },
    {
      id: 443,
      name: 'Casual Jacket Leather',
      image: '/laundry/dry clean/casual jacket leather women.jpg',
      price: 200,
      description: 'Leather jackets'
    },
    {
      id: 444,
      name: 'Casual Jacket',
      image: '/laundry/dry clean/causual jacket.jpg',
      price: 120,
      description: 'Regular casual jackets'
    },
    {
      id: 445,
      name: 'Dress- One Piece',
      image: '/laundry/dry clean/Dress- One Piece.jpg',
      price: 85,
      description: 'One piece dresses'
    },
  ],
  homeLinen: [
    {
      id: 501,
      name: 'Quilt Single Size',
      image: '/laundry/dry clean/Quilt Single Size.jpg',
      price: 150,
      description: 'Single size quilts'
    },
    {
      id: 502,
      name: 'Bedsheet Single Size',
      image: '/laundry/dry clean/Bedsheet Single Size.jpg',
      price: 80,
      description: 'Single size bedsheets'
    },
    {
      id: 503,
      name: 'Bedsheet Double/Queen Size',
      image: '/laundry/dry clean/Bedsheet Double Queen Size.jpg',
      price: 120,
      description: 'Double/Queen size bedsheets'
    },
    {
      id: 504,
      name: 'Bedsheet King Size',
      image: '/laundry/dry clean/Bedsheet King Size.jpg',
      price: 150,
      description: 'King size bedsheets'
    },
    {
      id: 505,
      name: 'Quilt Double/Queen Size',
      image: '/laundry/dry clean/quilt double queen size.jpg',
      price: 250,
      description: 'Double/Queen size quilts'
    },
    {
      id: 506,
      name: 'Quilt King Size',
      image: '/laundry/dry clean/quilt king size.jpg',
      price: 300,
      description: 'King size quilts'
    },
    {
      id: 507,
      name: 'Blanket Single Size',
      image: '/laundry/dry clean/Blanket Single Size.jpg',
      price: 120,
      description: 'Single size blankets'
    },
    {
      id: 508,
      name: 'Blanket Double/Queen Size',
      image: '/laundry/dry clean/Blanket Double Queen Size.jpg',
      price: 180,
      description: 'Double/Queen size blankets'
    },
    {
      id: 509,
      name: 'Blanket King Size',
      image: '/laundry/dry clean/Blanket King Size.jpg',
      price: 220,
      description: 'King size blankets'
    },
    {
      id: 510,
      name: 'Window Curtain',
      image: '/laundry/dry clean/Window Curtain.jpg',
      price: 100,
      description: 'Window curtains'
    },
    {
      id: 511,
      name: 'Door Curtain',
      image: '/laundry/dry clean/Door Curtain.jpg',
      price: 80,
      description: 'Door curtains'
    },
    {
      id: 512,
      name: 'Door Mat',
      image: '/laundry/dry clean/door mat.jpg',
      price: 60,
      description: 'Door mats'
    },
    {
      id: 513,
      name: 'Bath Towel',
      image: '/laundry/dry clean/Bath Towel.jpg',
      price: 50,
      description: 'Bath towels'
    },
    {
      id: 514,
      name: 'Hand Towel',
      image: '/laundry/dry clean/Hand Towel.jpg',
      price: 30,
      description: 'Hand towels'
    },
    {
      id: 515,
      name: 'Small Table Cloth',
      image: '/laundry/dry clean/Small Table Cloth.avif',
      price: 40,
      description: 'Small table covers'
    },
    {
      id: 516,
      name: 'Big Table Cloth',
      image: '/laundry/dry clean/Big Table Cloth.avif',
      price: 80,
      description: 'Large table covers'
    },
    {
      id: 517,
      name: 'Car Cover',
      image: '/laundry/dry clean/car cover.jpg',
      price: 200,
      description: 'Car covers'
    },
    {
      id: 518,
      name: 'Comforter Single',
      image: '/laundry/dry clean/Comforter Single.jpg',
      price: 180,
      description: 'Single size comforters'
    },
    {
      id: 519,
      name: 'Comforter Double',
      image: '/laundry/dry clean/Comforter Double.jpg',
      price: 280,
      description: 'Double size comforters'
    },
    {
      id: 520,
      name: 'Bed Cover',
      image: '/laundry/dry clean/Bed Cover.avif',
      price: 120,
      description: 'Bed covers'
    },
    {
      id: 521,
      name: 'Pillow Cover',
      image: '/laundry/dry clean/Pillow Cover.jpg',
      price: 25,
      description: 'Pillow covers'
    },
    {
      id: 522,
      name: 'Cushion Cover',
      image: '/laundry/dry clean/Cushion Cover.jpg',
      price: 30,
      description: 'Cushion covers'
    },
  ],
  accessories: [
    {
      id: 601,
      name: 'Tie',
      image: '/laundry/dry clean/Tie.webp',
      price: 35,
      description: 'Neckties'
    },
    {
      id: 602,
      name: 'Small Bag',
      image: '/laundry/dry clean/Small Bag.webp',
      price: 60,
      description: 'Small bags'
    },
    {
      id: 603,
      name: 'Medium Bag',
      image: '/laundry/dry clean/Medium Bag.jpg',
      price: 80,
      description: 'Medium bags'
    },
    {
      id: 604,
      name: 'Large Bag',
      image: '/laundry/dry clean/Large Bag.jpg',
      price: 120,
      description: 'Large bags'
    },
    {
      id: 605,
      name: 'Normal Cap/Hat',
      image: '/laundry/dry clean/Normal Cap Hat.jpg',
      price: 40,
      description: 'Regular caps and hats'
    },
    {
      id: 606,
      name: 'Socks Cotton',
      image: '/laundry/dry clean/socks cotton.jpg',
      price: 20,
      description: 'Cotton socks'
    },
    {
      id: 607,
      name: 'Handkerchief Cotton',
      image: '/laundry/dry clean/Handkerchief Cotton.jpg',
      price: 15,
      description: 'Cotton handkerchiefs'
    },
    {
      id: 608,
      name: 'Handkerchief Silk',
      image: '/laundry/dry clean/Handkerchief Silk.jpg',
      price: 25,
      description: 'Silk handkerchiefs'
    },
    {
      id: 609,
      name: 'Bath Robe',
      image: '/laundry/dry clean/Bath Robe.jpg',
      price: 120,
      description: 'Bath robes'
    },
    {
      id: 610,
      name: 'Apron',
      image: '/laundry/dry clean/apron.jpg',
      price: 50,
      description: 'Kitchen aprons'
    },
    {
      id: 611,
      name: 'Leather Gloves',
      image: '/laundry/dry clean/Leather Gloves.jpg',
      price: 80,
      description: 'Leather gloves'
    },
  ],
  winterWear: [
    {
      id: 701,
      name: 'Woollen Innerwear Top',
      image: '/laundry/dry clean/Woollen Innerwear Top.jpg',
      price: 60,
      description: 'Woollen inner tops'
    },
    {
      id: 702,
      name: 'Woollen Innerwear Bottom',
      image: '/laundry/dry clean/Woollen Innerwear Bottom.jpg',
      price: 65,
      description: 'Woollen inner bottoms'
    },
    {
      id: 703,
      name: 'Long Coat',
      image: '/laundry/dry clean/Long Coat.jpg',
      price: 250,
      description: 'Long winter coats'
    },
    {
      id: 704,
      name: 'Quilted Jacket',
      image: '/laundry/dry clean/quilted jacket.jpg',
      price: 180,
      description: 'Quilted jackets'
    },
    {
      id: 705,
      name: 'Woollen Coat Half',
      image: '/laundry/dry clean/Woollen Coat Half.jpg',
      price: 200,
      description: 'Half-length woollen coats'
    },
    {
      id: 706,
      name: 'Woollen Coat Full',
      image: '/laundry/dry clean/Woollen Coat Full.jpg',
      price: 280,
      description: 'Full-length woollen coats'
    },
    {
      id: 707,
      name: 'Shawl',
      image: '/laundry/dry clean/Shawl.jpg',
      price: 70,
      description: 'Woollen shawls'
    },
    {
      id: 708,
      name: 'Cardigan/Shrug',
      image: '/laundry/dry clean/Cardigan Shrug.jpg',
      price: 80,
      description: 'Cardigans and shrugs'
    },
    {
      id: 709,
      name: 'Scarf/Muffler',
      image: '/laundry/dry clean/Scarf Muffler.jpg',
      price: 45,
      description: 'Scarfs and mufflers'
    },
    {
      id: 710,
      name: 'Windcheater',
      image: '/laundry/dry clean/Windcheater.webp',
      price: 120,
      description: 'Windcheater jackets'
    },
    {
      id: 711,
      name: 'Sweater',
      image: '/laundry/dry clean/sweater.jpg',
      price: 90,
      description: 'Woollen sweaters'
    },
    {
      id: 712,
      name: 'Sweatshirt/Hoodie',
      image: '/laundry/dry clean/sweatshirt.jpg',
      price: 100,
      description: 'Sweatshirts and hoodies'
    },
    {
      id: 713,
      name: 'Woollen Gloves',
      image: '/laundry/dry clean/Woollen Gloves.jpg',
      price: 40,
      description: 'Woollen gloves'
    },
    {
      id: 714,
      name: 'Woollen Cap/Hat',
      image: '/laundry/dry clean/Woollen Cap Hat.jpg',
      price: 35,
      description: 'Woollen caps and hats'
    },
    {
      id: 715,
      name: 'Socks Woollen',
      image: '/laundry/dry clean/Socks Woollen.jpg',
      price: 30,
      description: 'Woollen socks'
    },
  ],
  kids: [
    {
      id: 801,
      name: 'Kids Bottomwear',
      image: '/laundry/dry clean/Kids Bottomwear.jpg',
      price: 45,
      description: 'Kids bottom wear'
    },
    {
      id: 802,
      name: 'Kids Topwear',
      image: '/laundry/dry clean/Kids Topwear.jpg',
      price: 40,
      description: 'Kids top wear'
    },
    {
      id: 803,
      name: 'Kids Woollenwear Top',
      image: '/laundry/dry clean/Kids Woollenwear Top.webp',
      price: 60,
      description: 'Kids woollen tops'
    },
    {
      id: 804,
      name: 'Kids Woollenwear Bottom',
      image: '/laundry/dry clean/Kids Woollenwear Bottom.jpg',
      price: 65,
      description: 'Kids woollen bottoms'
    },
    {
      id: 805,
      name: 'Kids Jacket',
      image: '/laundry/dry clean/kids jacket.webp',
      price: 80,
      description: 'Kids jackets'
    },
  ]
};

const shoeCleanItems = {
  shoes: [
    {
      id: 901,
      name: 'Boots',
      image: '/laundry/shoe clean/boots.jpg',
      price: 120,
      description: 'All types of boots'
    },
    {
      id: 902,
      name: 'Normal Shoes',
      image: '/laundry/shoe clean/Normal Shoes.jpg',
      price: 80,
      description: 'Regular casual shoes'
    },
    {
      id: 903,
      name: 'Leather Shoes',
      image: '/laundry/shoe clean/leather shoes.jpg',
      price: 100,
      description: 'Formal leather shoes'
    },
    {
      id: 904,
      name: 'Sports Shoes',
      image: '/laundry/shoe clean/Sports Shoes.jpg',
      price: 90,
      description: 'Athletic and sports shoes'
    },
    {
      id: 905,
      name: 'Heels',
      image: '/laundry/shoe clean/Heels.jpg',
      price: 110,
      description: 'High heels and formal shoes'
    },
  ]
};

const bedsheetWashItems = {
  homeLinen: [
    {
      id: 1001,
      name: 'Wash-Single Size',
      image: '/laundry/bedsheet/Wash-Single Size.webp',
      price: 60,
      description: 'Single size bedsheet washing'
    },
    {
      id: 1002,
      name: 'Wash-Double Size',
      image: '/laundry/bedsheet/Wash-Double Size.webp',
      price: 80,
      description: 'Double size bedsheet washing'
    },
    {
      id: 1003,
      name: 'Wash-King Size',
      image: '/laundry/bedsheet/Wash-King Size.webp',
      price: 100,
      description: 'King size bedsheet washing'
    },
    {
      id: 1004,
      name: 'Sofa Cover',
      image: '/laundry/bedsheet/Sofa Cover.jpg',
      price: 120,
      description: 'Sofa cover heavy washing'
    },
    {
      id: 1005,
      name: 'Iron-Single Size',
      image: '/laundry/bedsheet/Iron-Single Size.webp',
      price: 40,
      description: 'Single size bedsheet ironing'
    },
    {
      id: 1006,
      name: 'Iron-Double Size',
      image: '/laundry/bedsheet/Iron-Double Size.webp',
      price: 60,
      description: 'Double size bedsheet ironing'
    },
    {
      id: 1007,
      name: 'Iron-King Size',
      image: '/laundry/bedsheet/Iron-King Size.webp',
      price: 80,
      description: 'King size bedsheet ironing'
    },
    {
      id: 1008,
      name: 'Wash&Iron-Single',
      image: '/laundry/bedsheet/Wash&Iron-Single.webp',
      price: 90,
      description: 'Single size wash and iron'
    },
    {
      id: 1009,
      name: 'Wash&Iron-Double',
      image: '/laundry/bedsheet/Wash&Iron-Double.webp',
      price: 120,
      description: 'Double size wash and iron'
    },
    {
      id: 1010,
      name: 'Wash&Iron-King',
      image: '/laundry/bedsheet/Wash&Iron-King.webp',
      price: 150,
      description: 'King size wash and iron'
    },
  ]
};

export default function LaundryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('wash-fold');
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const { addToCart, updateQuantity } = useCart();
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Check for booking data from HeroSection
  useEffect(() => {
    const storedBooking = localStorage.getItem('pendingBooking');
    if (storedBooking) {
      const data = JSON.parse(storedBooking);
      // Only show booking data if it's for laundry service and within 10 minutes
      if (data.category === 'Laundry Service' && (Date.now() - data.timestamp) < 600000) {
        setBookingData(data);
      }
    }
  }, []);

  const clearBookingData = () => {
    setBookingData(null);
    localStorage.removeItem('pendingBooking');
  };

  const addToBasket = (item) => {
    const currentQuantity = quantities[item.id] || 0;
    setQuantities(prev => ({
      ...prev,
      [item.id]: currentQuantity + 1
    }));
  };

  const removeFromBasket = (item) => {
    const currentQuantity = quantities[item.id] || 0;
    if (currentQuantity > 0) {
      setQuantities(prev => ({
        ...prev,
        [item.id]: currentQuantity - 1
      }));
    }
  };

  const getItemQuantity = (itemId) => {
    return quantities[itemId] || 0;
  };

  const addSelectedItemsToCart = () => {
    // Check all categories for items with quantities, regardless of active category
    const allCategoryItems = [
      { items: clothingItems, categoryName: 'Laundry Service' },
      { items: ironingItems, categoryName: 'Ironing Service' },
      { items: dryCleanItems, categoryName: 'Dry Clean Service' },
      { items: shoeCleanItems, categoryName: 'Shoe Clean Service' },
      { items: bedsheetWashItems, categoryName: 'Bedsheet/Heavy Wash Service' }
    ];
    
    allCategoryItems.forEach(({ items, categoryName }) => {
      Object.entries(items).forEach(([category, itemsList]) => {
        itemsList.forEach(item => {
          const quantity = quantities[item.id];
          if (quantity && quantity > 0) {
            const cartItem = {
              id: `laundry-${item.id}`,
              name: item.name,
              image: item.image,
              price: item.price,
              category: categoryName,
              type: 'laundry',
              description: item.description
            };
            
            // Add the item first, then update quantity to the correct amount
            addToCart(cartItem);
            // Update the quantity to match the selected quantity
            updateQuantity(`laundry-${item.id}`, quantity);
          }
        });
      });
    });
    
    // Clear quantities
    setQuantities({});
    
    // Navigate to cart
    navigate('/cart');
  };

  const getTotalItems = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    let total = 0;
    
    // Check all categories for items with quantities, regardless of active category
    const allCategoryItems = [
      clothingItems,
      ironingItems,
      dryCleanItems,
      shoeCleanItems,
      bedsheetWashItems
    ];
    
    allCategoryItems.forEach(categoryItems => {
      Object.entries(categoryItems).forEach(([category, items]) => {
        items.forEach(item => {
          const quantity = quantities[item.id] || 0;
          total += item.price * quantity;
        });
      });
    });
    
    return total;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide functionality - removed as we don't need category slider

  // Touch handlers - removed as we don't need swipe functionality for categories

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Booking Data Banner */}
        {bookingData && (
          <div className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  👕 Your Laundry Service Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">Service:</span> {bookingData.category}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Pickup Date:</span> {new Date(bookingData.pickupDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Phone:</span> {bookingData.phoneNumber}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Location:</span> {bookingData.address.substring(0, 50)}...
                  </div>
                </div>
                <p className="text-purple-600 text-sm mt-2">
                  Please select your laundry service type below to complete your booking.
                </p>
              </div>
              <button
                onClick={clearBookingData}
                className="text-purple-500 hover:text-purple-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Main Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Laundry Services</h1>
        </div>

        {/* Service Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              { id: 'wash-fold', label: 'Wash & Fold' },
              { id: 'wash-iron', label: 'Wash & Iron' },
              { id: 'ironing', label: 'Ironing' },
              { id: 'dry-clean', label: 'Dry Clean' },
              { id: 'shoe-clean', label: 'Shoe Clean' },
              { id: 'bedsheet-wash', label: 'Bedsheet Wash' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active category */}
        {(activeCategory === 'wash-fold' || activeCategory === 'wash-iron') && (
          <div>
            {/* Men's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Men's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clothingItems.men.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Women's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Women's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clothingItems.women.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Linen Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Home Linen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {clothingItems.homeLinen.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Accessories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {clothingItems.accessories.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winter Wear Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Winter Wear
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clothingItems.winterWear.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Kids Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {clothingItems.kids.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ironing Category Content */}
        {activeCategory === 'ironing' && (
          <div>
            {/* Men's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Men's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ironingItems.men.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Women's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Women's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ironingItems.women.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Linen Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Home Linen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ironingItems.homeLinen.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Accessories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ironingItems.accessories.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winter Wear Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Winter Wear
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ironingItems.winterWear.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Kids Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ironingItems.kids.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dry Clean Category Content */}
        {activeCategory === 'dry-clean' && (
          <div>
            {/* Men's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Men's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.men.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Women's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Women's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.women.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Linen Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Home Linen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.homeLinen.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Accessories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.accessories.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winter Wear Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Winter Wear
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.winterWear.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Kids Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.kids.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shoe Clean Category Content */}
        {activeCategory === 'shoe-clean' && (
          <div>
            {/* Shoes Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Shoes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shoeCleanItems.shoes.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bedsheet/Heavy Wash Category Content */}
        {activeCategory === 'bedsheet-wash' && (
          <div>
            {/* Home Linen Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Home Linen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {bedsheetWashItems.homeLinen.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other categories */}
        {activeCategory !== 'wash-fold' && activeCategory !== 'wash-iron' && activeCategory !== 'ironing' && activeCategory !== 'dry-clean' && activeCategory !== 'shoe-clean' && activeCategory !== 'bedsheet-wash' && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-600 mb-4">Coming Soon</h3>
            <p className="text-gray-500">This service category will be available soon.</p>
          </div>
        )}

        {/* Add to Cart Button - Fixed at bottom when items selected */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm text-gray-600">{getTotalItems()} items selected</p>
                <p className="text-lg font-bold text-gray-800">₹{getTotalPrice()}</p>
              </div>
              <button
                onClick={addSelectedItemsToCart}
                className="bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}