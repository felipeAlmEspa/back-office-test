import { IItemTreeNode } from "@itsa-develop/itsa-fe-components";

export const dataTreeNode: IItemTreeNode[] = [
  {
    id: 137,
    name: "NEW ITEM 1 N1",
    active: true,
    children: [
      {
        id: 138,
        name: "NEW ITEM 1 N2 P1",
        active: true,
        children: [
          {
            id: 139,
            name: "NEW ITEM 1 ITEM  N3",
            active: true,
            children: [],
            level: 2,
          },
        ],
        level: 1,
      },
    ],
    level: 0,
  },
  {
    id: 140,
    name: "NEW ITEM 2 N1",
    active: true,
    children: [
      {
        id: 141,
        name: "NEW ITEM 3 ITEM TEST 2",
        active: true,
        children: [],
        level: 1,
      },
    ],
    level: 0,
  },
];