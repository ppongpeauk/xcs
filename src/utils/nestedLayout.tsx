const nestedLayout = (parent : any, child : any) => (page : any) => parent(child(page)) as any;

export default nestedLayout;