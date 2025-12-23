// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '../generated/prisma/client';
// import { faker } from '@faker-js/faker';

// const prisma = new PrismaClient({
//   adapter: new PrismaPg({
//     connectionString: process.env.DATABASE_URL as string,
//   }),
// });

// const createUser = async () => {
//   for (let i = 0; i < 10; i++) {
//     const gender = faker.person.sexType();
//     const firstName = faker.person.firstName(gender);
//     const lastName = faker.person.lastName(gender);
//     const age = faker.number.int({ min: 18, max: 65 });
//     const email = faker.internet.email({ firstName, lastName }).toLowerCase();
//     const password = faker.internet.password({ length: 10, memorable: true });
//     const role = i == 0 ? 'ADMIN' : 'USER';
//     await prisma.user.create({
//       data: {
//         firstName,
//         lastName,
//         gender,
//         age,
//         email,
//         password,
//         role,
//       },
//     });
//   }
// };

// const createCategory = async () => {
//   await prisma.category.createMany({
//     data: [{ name: 'Electronics' }, { name: 'Music' }, { name: 'Food' }],
//   });
// };

// const createCart = async () => {
//   const users = await prisma.user.findMany();
//   for (const user of users) {
//     const cartExists = await prisma.cart.findUnique({
//       where: { user_id: user.id },
//     });

//     if (!cartExists) {
//       await prisma.cart.create({
//         data: {
//           user_id: user.id,
//         },
//       });
//     }
//   }

//   const carts = await prisma.cart.findMany();
//   const products = await prisma.product.findMany();

//   for (const cart of carts) {
//     const randomProduct = products[Math.floor(Math.random() * products.length)];

//     // Using upsert to prevent unique constraint violations on re-runs
//     await prisma.cartItem.upsert({
//       where: {
//         // Assuming you have @@unique([cart_id, product_id]) in schema
//         // If you don't, you can use create() directly but upsert is safer
//         cart_id_product_id: {
//           cart_id: cart.id,
//           product_id: randomProduct.id,
//         },
//       },
//       update: {},
//       create: {
//         quantity: faker.number.int({ min: 1, max: 10 }),
//         product_id: randomProduct.id,
//         cart_id: cart.id,
//       },
//     });
//   }
// };

// const createProduct = async () => {
//   // Fix: Fetch real categories to get valid IDs
//   const categories = await prisma.category.findMany();

//   for (let i = 0; i < 20; i++) {
//     const randomCategory = categories[Math.floor(Math.random() * categories.length)];

//     await prisma.product.create({
//       data: {
//         name: faker.commerce.productName(),
//         description: faker.commerce.productDescription(),
//         price: parseFloat(faker.commerce.price()),
//         stock: faker.number.int({ min: 10, max: 100 }),
//         image: faker.image.url(),
//         category_id: randomCategory.id, // Use real ID
//       },
//     });
//   }
// };

// const createWishlist = async () => {
//   for (let i = 0; i < 5; i++) {
//     const randomUserId = faker.number.int({ min: 1, max: 10 });
//     await prisma.wishlist.create({
//       data: {
//         user_id: randomUserId,
//       },
//     });
//   }

//   for (let i = 0; i < 5; i++) {
//     const randomWishlistId = faker.number.int({ min: 1, max: 5 });
//     const randomProductId = faker.number.int({ min: 1, max: 20 });
//     await prisma.wishlistItem.create({
//       data: {
//         wishlist_id: randomWishlistId,
//         product_id: randomProductId,
//       },
//     });
//   }
// };

// const createReview = async () => {
//   for (let i = 0; i < 10; i++) {
//     const randomUserId = faker.number.int({ min: 1, max: 10 });
//     const randomProductId = faker.number.int({ min: 1, max: 20 });
//     await prisma.review.create({
//       data: {
//         rating: faker.number.int({ min: 1, max: 5 }),
//         user_id: randomUserId,
//         product_id: randomProductId,
//       },
//     });
//   }
// };

// const createOrder = async () => {
//   for (let i = 1; i <= 10; i++) {
//     await prisma.order.create({
//       data: {
//         card_name: faker.person.fullName(),
//         card_number: faker.finance.creditCardNumber(),
//         address: faker.location.streetAddress(),
//         phone: faker.phone.number(),
//         user_id: i,
//       },
//     });

//     await prisma.orderLog.create({
//       data: {
//         status: 'processing',
//         order_id: i,
//       },
//     });
//   }

//   for (let i = 0; i < 20; i++) {
//     await prisma.orderItem.create({
//       data: {
//         price: parseFloat(faker.commerce.price()),
//         quantity: faker.number.int({ min: 1, max: 5 }),
//         order_id: faker.number.int({ min: 1, max: 10 }),
//         product_id: faker.number.int({ min: 1, max: 20 }),
//       },
//     });
//   }
// };

// const main = async () => {
//   await createUser();
//   await createCategory();
//   await createProduct();
//   await createCart();
//   await createWishlist();
//   await createReview();
//   await createOrder();
// };

import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient, Role, Status } from '../generated/prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});

const main = async () => {
  await prisma.orderItem.deleteMany();
  await prisma.orderLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();

  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();

  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. USERS
  const userData = Array.from({ length: 10 }).map((_, i) => {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName(gender);
    return {
      firstName,
      lastName,
      gender,
      age: faker.number.int({ min: 18, max: 65 }),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: faker.internet.password({ length: 10, memorable: true }),
      role: i === 0 ? Role.ADMIN : Role.USER,
    };
  });

  await prisma.user.createMany({
    data: userData,
  });

  // 2. CATEGORIES
  await prisma.category.createMany({
    data: [{ name: 'Electronics' }, { name: 'Music' }, { name: 'Food' }],
  });

  // 3. PRODUCTS
  const categories = await prisma.category.findMany();

  const productData = Array.from({ length: 20 }).map(() => {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.number.int({ min: 10, max: 100 }),
      image: faker.image.url(),
      category_id: randomCategory.id,
    };
  });

  await prisma.product.createMany({ data: productData });

  // 4. CARTS
  const users = await prisma.user.findMany();

  const cartData = users.map((user) => ({
    user_id: user.id,
  }));

  await prisma.cart.createMany({
    data: cartData,
  });

  // 5. CART ITEMS
  const carts = await prisma.cart.findMany();
  const products = await prisma.product.findMany();
  const cartItemsData: Prisma.CartItemCreateManyInput[] = [];

  for (const cart of carts) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    cartItemsData.push({
      quantity: faker.number.int({ min: 1, max: 10 }),
      product_id: randomProduct.id,
      cart_id: cart.id,
    });
  }

  await prisma.cartItem.createMany({
    data: cartItemsData,
  });

  // 6. WISHLISTS
  // Create wishlist for first 5 users
  const wishlistUsers = users.slice(0, 5);
  const wishlistData = wishlistUsers.map((user) => ({
    user_id: user.id,
  }));

  await prisma.wishlist.createMany({
    data: wishlistData,
    skipDuplicates: true,
  });

  // 7. WISHLIST ITEMS
  const wishlists = await prisma.wishlist.findMany();
  const wishlistItemData: Prisma.WishlistItemCreateManyInput[] = [];

  for (const wishlist of wishlists) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    wishlistItemData.push({
      wishlist_id: wishlist.id,
      product_id: randomProduct.id,
    });
  }

  await prisma.wishlistItem.createMany({
    data: wishlistItemData,
    skipDuplicates: true,
  });

  // 8. REVIEWS
  const reviewData = Array.from({ length: 10 }).map(() => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    return {
      rating: faker.number.int({ min: 1, max: 5 }),
      user_id: randomUser.id,
      product_id: randomProduct.id,
    };
  });

  await prisma.review.createMany({ data: reviewData });

  // 9. ORDERS & LOGS
  const orderData: Prisma.OrderCreateManyInput[] = [];

  for (let i = 0; i < 10 && i < users.length; i++) {
    orderData.push({
      card_name: faker.person.fullName(),
      card_number: faker.finance.creditCardNumber(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      user_id: users[i].id,
      status: Status.processing,
    });
  }

  await prisma.order.createMany({ data: orderData });

  const newOrders = await prisma.order.findMany();

  const orderLogData = newOrders.map((order) => ({
    status: 'processing' as const,
    order_id: order.id,
  }));

  await prisma.orderLog.createMany({
    data: orderLogData,
    skipDuplicates: true,
  });

  // --- 10. ORDER ITEMS (Bulk Create) ---
  const orderItemsData = Array.from({ length: 20 }).map(() => {
    const randomOrder = newOrders[Math.floor(Math.random() * newOrders.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    return {
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 5 }),
      order_id: randomOrder.id,
      product_id: randomProduct.id,
    };
  });

  await prisma.orderItem.createMany({ data: orderItemsData });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
