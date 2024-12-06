### To create toggle themes using next-themes and shadcn-ui. We have to go through 3 steps.

1. create a provider to wrap all the content of next application

```js
"use client";

import { ThemeProvider } from "./theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export default Providers;
```

2. create theme-provider to wrap the `children` prop of the providers component

```js
"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

3. create toggle component, using `next-themes`

```js
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DarkMode() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

4. Toggle logo color using `useTheme`

- `use client` flag
- const {theme} = useTheme()

### Connect to database

- use Prisma
- use Supabase (like firebase but for Postgres)

1. create project on supabase
2. go "connect" get the DB_URL and DIRECT_URL => store them in .env file
3. install prisma
4. setup instance

In development, the command next dev clears Node.js cache on run. This in turn initializes a new PrismaClient instance each time due to hot reloading that creates a connection to the database. This can quickly exhaust the database connections as each PrismaClient instance holds its own connection pool.

(Prisma Instance)[https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution]

- create utils/db.ts

```ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

5. Connect prisma to database

- copy template code below to the prisma.schema file
- run `npx prisma migrate dev --name init` -> more safe way
- or run `npx prisma db push` -> for first time, if you don't have any db already in place

```prisma
datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model TestProfile {
id  String @id @default(uuid())
name String
}
```

6. run prisma stuido => `npx prisma studio`

### create model for a table/collection

- go to prisma/prisma.schema

```prisma
model Product {
  id  String @id @default(uuid())
  name String
  company String @unique
  // etc..
}
```

\*\* To avoid some bugs:

- stop server

```bash
npx prisma db push
npx prisma studio
npm run dev
```

### create currencyFormater function

- this is a helper function
- using Intl

```js
//this is a helper function
//setup a format currency function

export const formatCurrency = (amount: number | null) => {
  const value = amount || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
```

### fetch products (featured products)

- Tạm thời chưa thấy request response gì hết, chắc từ từ sẽ xuất hiện.

```js
import db from "@/utils/db";

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({ where: { featured: true } });
  return products;
};
```

### Cau truc cua 1 carousel don gian - Structure of a simple carousel

```js
import hero1 from "@/public/images/hero1.jpg";
import hero2 from "@/public/images/hero2.jpg";
import hero3 from "@/public/images/hero3.jpg";
import hero4 from "@/public/images/hero4.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";

const carouselImage = [hero1, hero2, hero3, hero4];

function HeroCarousel() {
  return (
    <div className="hidden lg:block ">
      <Carousel>
        <CarouselContent>
          {carouselImage.map((image, index) => {
            return (
              <CarouselItem key={index + "image"}>
                <Card>
                  <CardContent className="p-2">
                    <Image
                      src={image}
                      alt="carousle-img"
                      className="w-full h-[24rem] rounded-md object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default HeroCarousel;
```

### Loading theo section

`import { Suspense } from "react";`

-> cần chỗ nào thì để ngay chỗ đó, xài fallback = {<LoadingComponent/>}

```js
async function HomePage() {
  return (
    <div>
      <Hero />
      <LoadingContainer />
      {/* <Suspense fallback={<LoadingContainer />}>
        <FeatureProducts />
      </Suspense> */}
    </div>
  );
}

export default HomePage;
```

### Loading Container

-> use Skeleton component from Shadcn-ui

```js
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function LoadingContainer() {
  return (
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <LoadingProduct />
      <LoadingProduct />
      <LoadingProduct />
    </div>
  );
}

function LoadingProduct() {
  return (
    <Card>
      <CardContent className="mt-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-4 w-3/4 mt-4" />
        <Skeleton className="h-4 w-1/2 mt-4" />
      </CardContent>
    </Card>
  );
}

export default LoadingContainer;
```

### Remember about search in find database

- if search = "" (empty string) => this return all the records
- if search = undefined => this return nothing (empty array)

### toggle layout grid/list

- không dùng state để toggle
- dùng Link href = '/products?layout=grid...'
- khi nhấn thì nó navigate lại cái trang hiện tại, nhưng có thêm query
- component hiện tại xài 1 prop có tên là searchParams để catch cái layout.
- nếu layout ==='grid' thì render gridsystem, nếu là 'list' thì render list

### Flex box và <Image> của next

- Dùng kết hợp thì Image phải set prop `width` và `height`, bỏ cái `fill`

### cach su dung URLSearchParams()

1. `const params = new URLSearchParams()`
2. add search params =>` params.set('search', value)`
3. add more => `params.set('more', randomValue)`
4. delete a param => `params.delete('search')` //delete search param
5. If there are some params on the URL, the URLSearchParams() will include them

### Lưu ý

- đối với next thì rất ít sử dụng `state` để bắt sự kiện nữa
- thay vào đó sẽ thao tác nhiều với `URL`
- cần quan tâm các thứ này"
  1. `useSearchParams()`
  2. use-debounce package
  3. `useRouter()` from `'next/navigate'`
  4. `URLSearchParams()`
- hạn chế đưa mấy cái fetch vô `useEffect` dễ bị lỗi dư 1 cái khi mới mount lại, nhứt là đối với các global component.
- Ví dụ search bar, là cái global component, trang nào nso cũng có, cứ mỗi trang load lại mà nó kiểm tra search value rồi navigate đi chỗ này chỗ kia thì bị lỗ
