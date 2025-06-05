export interface User {
    id: string;
    name: string;
  }
  
export const mockUsers: User[] = Array.from({ length: 1000 }, (_, idx) => {
    const id = (idx + 1).toString();
    return { id, name: `User ${id}` };
  });