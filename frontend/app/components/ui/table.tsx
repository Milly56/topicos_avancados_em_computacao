import * as React from "react";

export const Table = ({ children, className = "", ...props }: any) => (
  <table className={["min-w-full text-left", className].filter(Boolean).join(" ")} {...props}>
    {children}
  </table>
);

export const TableHeader = ({ children, className = "", ...props }: any) => (
  <thead className={className} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = "", ...props }: any) => (
  <tbody className={className} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = "", ...props }: any) => (
  <tr className={className} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = "", ...props }: any) => (
  <th className={["px-4 py-2 font-medium text-sm", className].filter(Boolean).join(" ")} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className = "", ...props }: any) => (
  <td className={["px-4 py-2 text-sm", className].filter(Boolean).join(" ")} {...props}>
    {children}
  </td>
);

export default Table;
