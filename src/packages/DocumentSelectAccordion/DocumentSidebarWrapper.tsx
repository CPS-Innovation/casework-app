export const DocumentSidebarWrapper = (p: { children: React.ReactNode }) => {
  return (
    <div style={{ background: '#ffffff', border: 'solid 1px black' }}>
      {p.children}
    </div>
  );
};
