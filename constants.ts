import { Product, Staff, InventoryItem } from './types';

export const IMAGES = {
  latteArt: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXJ56yFcKmlKmA1aK7Ocw0G4c6uAkPPh6MkplrzAah1p9hHW5px3OSoOi2SvhNYFOdmDAcKfRl4El3aAudMpU6fu3lEv3Ql1xQkOq--4ZNktBEnH8oBmJ6YEdrvAdeWc9zpfeaUy_KyOotSffviWH0hse8ZgvULvzyyeHjif-ONiRd2PoS2RchFU2y3CSECrdogu5b4DXA-fjSMUGWsAbIDN1IbWT1AphrIYdr4ByXaqsNOp0lPluQ9EAWp9cM38maYeAP9xTiLHYN",
  profile: "https://lh3.googleusercontent.com/aida-public/AB6AXuBze4b3iXDSOhgEMxMb8kfnfz5_1KYWJna-wHYajYzNMTsPMKFY6Se_b2mzcZybqchIlhzsKZFAFKItgYoKn0QyhPRlb_aZOBD7fNbxhmX3fyFVXmd6zwxhD0f6Ji42lBDLXGEBi-6l5lv2M1TH9odzPisv7a5dXkcx6tcfB3FKcbtrlwi77xLSFp161oCsdnl2I9m7rZRlvDjJoMqbyLSNKBTUQBk0xQPSy1yJTwZiq1QGCgsdeIP_RWhSoV6dft2NhR_U1K_JYy05",
  cappuccino: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Il1pi_dr6ez1-ng3FvlzDdMGM5znu02WXAQbQJXfHah9_xe_Bguq_IkFJUKq-WxvukXM5DP4ex_-k0tHKkFQUlMKw8ZnyZYCVnmY8mKhVjoxQtnGWEk2Ro9OwHDGsVmfs3ZpuJ658FAfRjl7aFDnzsRuqBeQt9wcvuP_KGaVzAIALHKSADgZPgI3Y6Yb2trRp3PkzaqTOtN4VTV4GOTsvL3ezc49xgWN3NLglSmHVmXNbw5QM0oGnyrLHcKVCVLjQzVOnYPSW4Yj",
  coldBrew: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf1u5-qOslMDBzyviUWyVFdAs6ZKsq7Kn0RPbRay4ND3Oiz5To23hWr065rCdjO8VgZ0CPTN5SvfgO6wtedCGrKCH1mGJHZiprw89OLBOm0EFZuP485pYZZdK52DE44IbD59_DNc217dihASms6oFNW2KyIk7zAUABWwU0rHbAx8LsRJsaKQMOZN05mabziUVAW6JhPwNU_Fd7KFBURbUfcHcNR6IlnCSLVNw4mH_HTpsRLo4MUFnP7nFPVw4-g55SlfQk6_Vdjwr8",
  croissant: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1Rr2UX1E_Mxeso2zf1tDO16uC_6SZS83EM1jhh6UTqe_4-uCm_-2ddy9cOtoL8JlQy3ex6hv8Bc3PNTOqx4o8zuS9xXLDuoU9ELAb1R5wY56-p7_5coRXYFFsWnqRFDwXoAioyfT96q2AFk_WSsYQkf_f61g9mso4rgdN2BVGVM4klyTAbfMMpGKszcGcO5nlHgGRwnBcze4Hbl-OCmFPlugvKfCx7pWiFdnQxg1pxYiSA_G30_N8lpmcXcLKXVX-nUww9hEPHOPx",
  beans: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIB9cZxLFB3HQMhEvHlF8XuofVO1pxAWX2SZDi-kZS8_IAaEpD2WzRqV4m3P4033XPD41dArXXkFTGjuaPciztdRES7DB__WD_S5qLUCQVBKCUvBl0H0W3EJ-h1a3rg09_-SF-wI0Qv-k_w_UWVLMuAIjxAfo3ShOwFaHcR0jwbcdcUbl-ROEyrMcb6uCOxt34EWXi3dcMWvo4aNKPVK8JKb40H_YQwBFx7oAZQGBPCAyu5BiH3v38OZsv2llc1erSk29fhXrSVTlu",
  map: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-A10aOIL6VLUWECo1mWLFWBVDQ73HodJcNIAAF1knrV--mgt25Wphe1GhuQR9J4s_yFm_vo5GczwXwoX0Fisq8yIKyNev_murhq5c-hUKYr4mEN7s8CcbZ1mpgsYgV4yAqoo7h92N-Y-YtfyoPjNgRDSIQYUeoiAzhNlYXl9GcZ7waihiEyg2oijaBBtMBlv0PWzRsVDUM8AAAPefAg5YdZJawTjkq_q8VD5KKlle2zq39ahFzdNYjmN0YyDyT4cTjQDqKvz1PwtD",
  qr: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ISH7WbXYQVSK5PvluDR6WhyUmm__9qxHpmyYI6ugguTlhvganyxjbJ08sRNQwUflcQqvyRo-bxLCuMtCNgCVmnrllR1M5qZKoTfi7RVww0CkQnQO_Uu73K_6qzAoEKWaISKFXKqlI_VBOkEUqqNX8CiBAW2l_snik8iUt5oDyRFKFgOiZNTUBPJjepqJXG7OxDGShpBy2Up_WJbpbmvUQUa2j5a2SXuFNLHAjLmKkAmwm0hS4zmuVoJ249TOxWnskysImIuLGex",
  friendToast: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt-UmT_bt3W_HV4u6-vmZtW1CUTKXsQRY64wyjToaVgNZkzpMyjW2ft_2zeLrwTBqZ6289EGVE09xT3ROlvWFKovUrbRo42rjysEJdGKGpArFrPiZmYHsqaR_gb3S8ERimT23tKoE6ImzTdI4GHAfUPZ1TlfFsRTwiBO10kgQBtDgnQ29SLD4Ue1_576mvD8ngGa5p1GKs0X8W4u66M6kg-HAX8PpHRyH51bxPJYOOq_LI-JCn5uCWM2VElfKPQnRWNjdMpXcexuZI",
  staff1: "https://lh3.googleusercontent.com/aida-public/AB6AXuATFKhNxulT_uhylFd184MEy0is9qyvPvP2al3bwidjmNQl_0yhz_jfXIardkabdupW9mzr8R_TbKaO-Vk2preocCtETSi3v39rWJE9kNWkyPrs1mj__7PDdDgp0Q15-qczBhM2GJAwFvlowaappPKMQehTPk8D5qSCiV2sudVNquQcwOoAIDDE_Qb3iwvDRYcNi9uRPa3bsoBRpd5s6D_RQbITM_fY9sYNAtonWiLXyiwbQ-49A52ngAACmEypFRJw-HpwC420pRqZ",
  staff2: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5bhTe5QP7aOZSnaUpwsGIbtp0H108dQeIQwillNrgeKzkXa5i15_svvLg37fNBIC1ijRJ_3dL1jC7hTtKEKgm8nY9KQB8_Qcn21HKISzrOMoK5PhjQ2dpbzRBSLUihoBP_peyJ_h_KO4OOzQ2PjMlZ0im1_ftsfP2RJKG3R4vXLZtHDWynsrhiCxTtzesU20clUK6QaeskvYidUCPrX68a3sDC1iHbNfk9RC6JLqxMgOhM8LIhYAkwpK0ZNAwJDt-j-Gt0nr3xaej",
  staff3: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcmKatw2uBOvwxS8QabugY2UWDiJtF9KLB951GAN15mrFsJV4eTfqb5OQOFf42M70Eakt418F9VSKGAYeSpJmF4MP9HEsth-ZIsSO9a86EeQi1PDqlO5-y_GqD56zw9r2i_3UrRxwDaoeZ7LblgHVBqrLP1M9qWLKkUtWSRd5Z0YPkOAmZDvLMEluslzvemVk59QJal1KMIhWEtACBOEzoeU_EnPLrDxlZ93ixjQ6t82E6pkdbdAEntnMakKI0We6RuofUbkL0Vecd",
  vanillaSyrup: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-dzqSpkqZmI6Kv7O8l52AzhkkQ3xmi1DOLJtrO6eASGb5Zs9O5NehVRTYGJmr5931xLtDwGRD8RCcnKbJrd4rufb65umykdR0fFeIOAbgD8DHl6a8xmmFkAdJGooY9LUN8Ugrqp7GESco415aL2pecNGxL27vZV8JnurFpOKRJwjBkxO8R9zw0HLjo7ci7JM5mUZg0ce_vVNgpPNrhR12kht-UnJhxrRcB5n6ZBhnBDrB0HnDjt5qFMkiXaJgGqA4Q5pYKAzp0pYv",
  oatMilk: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSKc1qZFjPsSkyM68M8c0FalAesP5FRSmpvxXKPUFc_GRCgbBgbYAqkaUUU12-X4AD5BDtUslfHLKwmeeQe7GUbYIxGCVLtWBnxM5L5C5HkMPk5DQNuFVgRMFg1VPKkh5WgtETdQBkPoh-L-x0Aw6W4kxoyfZadHMgmhbtjnO5Xe99vv34NvSkJ5Ro2ZZAlF8GzpD6A2XTuX0DRZyPsHVrNQwLewtwESkKgM-sc1w_zkR3pnI9CMvt-UjdItT9-4P7iDGZkk-QdriA",
  cups: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS-lTMiy8YEfQLYeWMCl2DVI-4oj6ADJfbaiz1dAlBYsOT01cRxDcnBTiohYDyeL0kM_JXnVprZIJZ21WG7cwBkKJipcM_d7YOxxldBwS0YFjPSm7pXBrIh-_I11pn79oq-0bw-O3ab3JZSS6ntJnBTY6WlVEO12d5BWFL2pThzZ_hqCm-7rjgmFy7nadxVqkZelKm06s6ppb5eNBkVc_3CI5t4imk5g3lVHiuqk1zGdx2DSk8vbBAClzD41H_IhNn6BNoaYPeIGYb",
  pumpkinSpice: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPhI5q6tz9szzAgSVdQ9aFOilbz5f7UAh9p44SPgXW8AoYd6rOAP6Wjkm56NfHVqff2cw9CG-_2J12wa_xVBT3USKW1gVWOGAtgFneP3OuStPVej1RzCZCsUd_2c_r4TycJ4SZxg2aP-iIgLzN-WwzYnpUVwqoEWPkjJG9dCwUhRqrInnjWjwDnoRpgg36LYp0YHjqedJ852BDqsw4zMBdkTJYhsj9QFgynRdajSTJanUSNf3_MZjEb1aHV7NLOL5jiL1LEWOuH3rF",
  matcha: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxCCUcSQ27mtXZtXwvPESa_dxYx_Kj4BUCi1Dlzg66Wxibcsc5ImTq1PNLLm4eBAv8hXMY2J2iNx8oA9gE7qCnSfK_9hcG1YyRrCKLv9SMDiuCgd5rmRVaUO8QVZ8Iy_spgEoyIZuiboD2sqDtsCw-Na34uY_vbKLNKx9apRq36eNTT5iDirm4vRJ56Jqn9fI-v5PkhPDznxOqTs3p55lLaWZ2ReUysGfJjqeb1LZ3NA6rysTcYbhbxbvgyPLSWC6K24HI6_XV8JWp",
  chocoCroissant: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM4SyPvn31ohbyJJCYtKXmqlwN9P3-D307jE6K2LKezVdwRGs-NeJfQ_dKIu80MdUaeGxaujGvMig3xaDyYVd8oBh2EQRb6SA8tYomTuFHUuGans-eDEelrvdFUpk7f1K7F4hGlpdHqGrEHwkI0HIz--qA65SNrSv0cXveCqhJ4mB9Cu0ZM_SmmTZmh2UMLs9z5OuAWVROJFqoJ_25WQLej96fvUYig2AzmsNU3M48LuXmCeaq-ujUaDdYV_xaY49lwjC5FvBpvNFQ"
};

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Cappuccino', description: 'With oat milk foam', price: 4.50, image: IMAGES.cappuccino, category: 'Hot Coffee', isPopular: true },
  { id: '2', name: 'Cold Brew', description: 'Smooth & strong', price: 5.00, image: IMAGES.coldBrew, category: 'Iced Coffee', isPopular: true },
  { id: '3', name: 'Pumpkin Spice', description: 'Limited time only', price: 6.20, image: IMAGES.pumpkinSpice, category: 'Seasonal', isPopular: true },
  { id: '4', name: 'Matcha Latte', description: 'Ceremonial grade', price: 5.50, image: IMAGES.matcha, category: 'Tea' },
  { id: '5', name: 'Choco Croissant', description: 'Freshly baked', price: 3.80, image: IMAGES.chocoCroissant, category: 'Pastries' },
  { id: '6', name: 'Espresso', description: 'Single origin beans', price: 3.00, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPIZheoZLOJ4x_dHZ3Rv1NhY1YukNaaSoRuhS46Cx5bHckeff6tDpjT8o328WABCFo6ZihLEaE0FhEcq2IEcyjEpGw7K95XnMK0CHlMI0GTJo0v-AHHziL-eNiOKJLHXwfAVoX6vQL4-lvXrN_pRwYzPPY9rjWIEc8xJQBgYCjaEaokPcF0DXqnxfPOZ9RTQootHaZE1lZSVxwerolUbkcLxLVs4VqlQMUnGysj-WBZke9KMwtw4FyJxIv8Y0EBWW3RTvP7TQ_2wZ_", category: 'Hot Coffee' }
];

export const STAFF: Staff[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'Head Barista', status: 'Active', image: IMAGES.staff1, shift: '06:00 - 14:00' },
  { id: '2', name: 'Mike Ross', role: 'Shift Manager', status: 'Inactive', image: IMAGES.staff2, shift: '14:00 - 22:00' },
  { id: '3', name: 'Elena Rodriguez', role: 'Barista', status: 'On Shift', image: IMAGES.staff3, shift: '09:00 - 17:00' },
  { id: '4', name: 'John Doe', role: 'Trainee', status: 'Active', image: '', shift: '12:00 - 18:00' }
];

export const INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Vanilla Syrup', category: 'Syrups', quantity: '1 Bottle Left', percentage: 15, status: 'Critical', image: IMAGES.vanillaSyrup },
  { id: '2', name: 'Oat Milk (Barista)', category: 'Dairy Alt', quantity: '12L', percentage: 60, status: 'Healthy', image: IMAGES.oatMilk },
  { id: '3', name: '12oz Cups', category: 'Supplies', quantity: '150', percentage: 30, status: 'Low', image: IMAGES.cups },
  { id: '4', name: 'Ethiopian Yirgacheffe', category: 'Beans', quantity: '8.5kg', percentage: 85, status: 'Healthy', image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeyEbeLQUdiC5JB-YXQ9V1RdDJ8dIkYCxqs_ry113U8bCIIg3GMVfgyC9xdQ43_SOOtkWMMmRKGNH2hizMVaMqhwfax0Tjm-m-ENqLR1AX-BDPw0TsqnUuLCFH8RzrqhIugGnh-GSIDGRwVw1e7ridi3290vORO-IQhMj6T8kjUUCjn24C5UOcurgW3G3WdbPeT5AivDar7uie6ROPPabrMDf2O0au4DJDx3PiedqlXCP2NsTfK8EFMaQtSDjjDAiFSes-gS2TKSF4" },
];

import { Store, OrderQueueItem, CustomerReview, Order, AnalyticsData, Reward } from './types';

export const STORES: Store[] = [
  { id: '1', name: 'Main St. Roastery', address: '123 Main Street', distance: '0.2 mi', rating: 4.8, isOpen: true, closingTime: '8 PM', busyLevel: 'Low', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtDAEcyfatQ7iPe46ayn6DS2PggttECS3Bv-wKFC1WGx09YXvFfba-9BIaClQ2-PzIct9rsSEUrJ_exa_nTVz2fwLeMOTdssucxInOQEQ_AwYs3YJR3IoBbDwb_t_2XozH5TF-olrceBhJiPVFB3KpWZu4fI6Z86gR7FmhxvHiVs0AUva4lOEoNm2o4rBERAc14EJ5LwvRPuA5cjCULXnVFQNuOkXlXNl3yyiuwH4HbH0CgfMnKf9aPQtntURsuYpIDe5AbDp6Gcaw', hasDriveThru: false, hasMobileOrder: true },
  { id: '2', name: 'Westside Espresso', address: '450 West Ave', distance: '1.5 mi', rating: 4.2, isOpen: true, closingTime: '6 PM', busyLevel: 'High', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmq_Apkc13OKDNXhI-dLLe-d1aNEK7OtIWy8Rfda0HbRVy_Ft5caHTrqilFtilbrKSSFk8HOtdQsCpfHynXtt9rkyvdjZ9L7u-ppQU017YZ3Ll0XVqpSvbtbIWQRgf53o2tq928ez-KFwYkdEkQgfApEMcwFDQixKWWGqQebseXgcGv-IATHbD_nBrkmCJI93RFo_GnyxGG1bdXUUCusdAa0epC9DlNVpUMTgBBvfjDQcku-ng53goCHxZYjxSeSME1FgEwd6RELns', hasDriveThru: true, hasMobileOrder: true },
  { id: '3', name: 'Uptown Brews', address: '88 North Blvd', distance: '2.8 mi', rating: 4.5, isOpen: false, closingTime: '6 AM', busyLevel: 'Low', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKoeXiKYYmP9BACIlniH27mjeOHzWQ_p_RjRZLxcaQZXFjaGlLE5LOF53Mh5diEVLuV3jH2VSkkVfwoZiJcCp72LJiFQvwdgS1lgeYAzsTTPltqT0wbIu6XgCPOSIQ-c0kYKno9kwN8v-hoEdGKQ_15vE1BQIraykgq01Rwm9gQjssXPtht3nngOApGNepcQDOhR9jK9RInnkV6MM13ptxaYhohmKqeny2r1nLnuVFSpZbICxpo2R_iHV-4XksBDCgtGzK9s7bLhod', hasDriveThru: true, hasMobileOrder: false },
];

export const ORDER_QUEUE: OrderQueueItem[] = [
  { id: '1', customerName: 'Sarah J.', orderNumber: '305', items: [{ name: 'Iced Latte', quantity: 1 }], customizations: ['Oat Milk', 'Vanilla Syrup'], status: 'Critical', timer: '12:04', image: IMAGES.coldBrew },
  { id: '2', customerName: 'David L.', orderNumber: '307', items: [{ name: 'Cappuccino', quantity: 2 }], customizations: ['Extra Hot'], status: 'Brewing', timer: '04:12', image: IMAGES.cappuccino },
  { id: '3', customerName: 'Mike T.', orderNumber: '306', items: [{ name: 'Americano', quantity: 1 }], customizations: ['Black', 'No Sugar'], status: 'New', timer: '00:45', image: IMAGES.coldBrew },
  { id: '4', customerName: 'Jenny W.', orderNumber: '308', items: [{ name: 'Pour Over', quantity: 1 }, { name: 'Croissant', quantity: 1 }], customizations: [], status: 'New', timer: '00:12', image: IMAGES.croissant },
];

export const REVIEWS: CustomerReview[] = [
  { id: '1', customerName: 'Alice M.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtl6CixJ6fIOrlaCMXzHTuuCMMPuHZk30dzxsNZ__ZkmIFsipzw5joPNNV8QriMt3qWC-FHsRbJNnYmyd4D8xrBfI2PnvrPpVKLtTnLxwo11poRB3t3sVOmJDJAExyXFIPhn57LdJSoT7iiY_1Cwf-3SRObuSZ9_6MVEvsSH-v26Win_j_6sCKFR1wMYKMnh4kJQv-uhIeBha_PjGxAccNphuaUcbZLgy9VnR2ndZZbRl7aUlLgyGl6CJgrVV-mttPaAbdAPrUMAn5', rating: 5, reviewText: 'Great espresso! The foam was perfect, and the service was super quick this morning.', product: 'Large Latte', timeAgo: '2h ago', isReplied: false },
  { id: '2', customerName: 'John D.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrb80ET8SpXOpVSXWIsP7bE7bu1zfdtlmBvjUcTV1Ld3xFvwUJfnc0I7djRSV8vY2y72hGNFcPod8kCjlMvakFawDqLNNt_Kr0r5cH_MN8aiT1WImEzMEGJV2_HSq34Y8nu5n1u0LTVrCanHmmPxVtYHnVRJxR2_DIJzxD8YaQQVyHYQdBoUC4o_7JPztiu44z4IrCC_wP1F3qxQHjXJPHbrtAc3QrlS1ktg7NBl_JP1ZS9QSlP2-ezUZtubeyuWqxBP8vaAwgN7Ki', rating: 2, reviewText: 'Coffee was cold upon arrival. Not what I expected for the price.', product: 'Americano', timeAgo: '5h ago', isReplied: false },
  { id: '3', customerName: 'Sarah L.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrCX3rtIA4EhF-oh3lG9fmmw1GJ6UY7jZP0AUfuMHfiknFDp2ZEMJkuJ9-ml890GNE6pp7iK-GRHbxg3dEEFTKEPm63UpH0J4sWpqDR9uzfFIojrhDhjyb-FBQ0_GKwRF1p7mZAehfq5Fr1iitZUkrx9Od1_BtD9FCvQLVK-ezrz_NhDxSn1GyB7ZuVL1wta_bUE-7Fl2Uopeb4Aj2nMRRDPcpyH_tXEEk_y01WHEienIkoOeMmXIl57xqVAFjgtJdAR_oLcq5nYNr', rating: 4, reviewText: 'Good, but forgot the sugar I requested in the notes.', product: 'Cappuccino', timeAgo: '1d ago', isReplied: true },
];

export const PAST_ORDERS: Order[] = [
  { id: '1', items: ['Vanilla Latte (M)', 'Croissant'], total: 8.30, status: 'Completed', date: 'Today, 8:32 AM', customerName: 'Alex' },
  { id: '2', items: ['Cold Brew (L)', 'Oat Milk'], total: 6.50, status: 'Completed', date: 'Yesterday, 3:15 PM', customerName: 'Alex' },
  { id: '3', items: ['Cappuccino (S)', 'Espresso'], total: 7.50, status: 'Completed', date: 'Oct 12, 9:00 AM', customerName: 'Alex' },
];

export const ANALYTICS_DATA: AnalyticsData = {
  totalOrders: 342,
  orderChange: 12,
  revenue: 1240,
  revenueChange: -2,
  activeMembers: 89,
  memberChange: 5,
  peakHour: '1:00 PM',
  topSellers: [
    { name: 'Caramel Macchiato', count: 1245, percentage: 85 },
    { name: 'Cold Brew', count: 982, percentage: 65 },
    { name: 'Oat Latte', count: 754, percentage: 45 },
  ],
  loyaltyLeaders: [
    { name: 'Sarah J.', points: 4500, lastVisit: '2h ago', avatar: IMAGES.staff1 },
    { name: 'Mike T.', points: 4200, lastVisit: 'Yesterday', avatar: IMAGES.staff2 },
    { name: 'Emma W.', points: 3900, lastVisit: '3 days ago', avatar: IMAGES.staff3 },
  ],
};

export const REWARDS: Reward[] = [
  { id: '1', name: 'Free Coffee', pointsCost: 100, image: IMAGES.cappuccino, description: 'Any size, any style' },
  { id: '2', name: 'Free Pastry', pointsCost: 75, image: IMAGES.croissant, description: 'Choose from our bakery' },
  { id: '3', name: '50% Off Drink', pointsCost: 50, image: IMAGES.coldBrew, description: 'Valid on any beverage' },
];

