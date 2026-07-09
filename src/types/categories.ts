// export interface Category {
//   /** Unique slug, also used to route to a category detail page later */
//   id: string;
//   /** English label shown in uppercase */
//   titleEn: string;
//   /** Farsi label shown under the English one, right-to-left */
//   titleFa: string;
//   /** Path to the thumbnail image, relative to /public */
//   image: string;
// }
export interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: string;
  image: string;
}

export interface Category {
  id: string;
  titleFa: string;
  titleEn: string;
  image: string;
  items: MenuItem[];
}
