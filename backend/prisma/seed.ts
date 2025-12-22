import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});

const createUser = async () => {
  for (let i = 0; i < 10; i++) {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName(gender);
    const age = faker.number.int({ min: 18, max: 65 });
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const password = faker.internet.password({ length: 10, memorable: true });
    const role = i == 0 ? 'ADMIN' : 'USER';
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        gender,
        age,
        email,
        password,
        role,
      },
    });
  }
};

const createCategory = async () => {
  await prisma.category.createMany({
    data: [{ name: 'Electronics' }, { name: 'Music' }, { name: 'Food' }],
  });
};

const createCart = async () => {
  for (let i = 0; i < 10; i++) {
    const cartExists = await prisma.cart.findUnique({
      where: { user_id: i },
    });

    if (!cartExists) {
      await prisma.cart.create({
        data: {
          user_id: i,
        },
      });
    }
  }

  for (let i = 0; i < 10; i++) {
    const randomProductId = faker.number.int({ min: 1, max: 20 });
    await prisma.cartItem.create({
      data: {
        quantity: faker.number.int({ min: 1, max: 10 }),
        product_id: randomProductId,
        cart_id: i,
      },
    });
  }
};

const createProduct = async () => {
  for (let i = 0; i < 20; i++) {
    const randomCategoryId = faker.number.int({ min: 1, max: 3 });
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 10, max: 100 }),
        image: faker.image.url(),
        category_id: randomCategoryId,
      },
    });
  }
};

const createWishlist = async () => {
  for (let i = 0; i < 5; i++) {
    const randomUserId = faker.number.int({ min: 1, max: 10 });
    await prisma.wishlist.create({
      data: {
        user_id: randomUserId,
      },
    });
  }

  for (let i = 0; i < 5; i++) {
    const randomWishlistId = faker.number.int({ min: 1, max: 5 });
    const randomProductId = faker.number.int({ min: 1, max: 20 });
    await prisma.wishlistItem.create({
      data: {
        wishlist_id: randomWishlistId,
        product_id: randomProductId,
      },
    });
  }
};

const createReview = async () => {
  for (let i = 0; i < 10; i++) {
    const randomUserId = faker.number.int({ min: 1, max: 10 });
    const randomProductId = faker.number.int({ min: 1, max: 20 });
    await prisma.review.create({
      data: {
        rating: faker.number.int({ min: 1, max: 5 }),
        user_id: randomUserId,
        product_id: randomProductId,
      },
    });
  }
};

const createOrder = async () => {
    for (let i = 0; i < 10; i++) {
        await prisma.order.create({
            data: {
                card_name: faker.person.fullName(),
                card_number: faker.finance.creditCardNumber(),
                address: faker.location.streetAddress(),
                phone: faker.phone.number(),
                user_id: i
            }
        })

        await prisma.orderLog.create({
            data: {
                status: 'processing',
                order_id: i
            }
        })
    }

    for (let i = 0; i < 20; i++) {
        await prisma.orderItem.create({
            data: {
                price: parseFloat(faker.commerce.price()),
                quantity: faker.number.int({ min: 1, max: 5}),
                order_id: faker.number.int({ min: 1, max: 10}),
                product_id: faker.number.int({ min: 1, max: 20})
            }
        })
    }


};

const main = async () => {
  await createUser();
  await createCategory();
  await createProduct();
  await createCart();
  await createWishlist();
  await createReview();
  await createOrder();
};

main().catch((e) => {
  console.error('Seeding failed: ', e);
  process.exit(1);
});
