import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
} from "@mui/material";

interface Column {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  minWidth?: number;
  format?: (value: any, row: any) => React.ReactNode;
}


interface PaginatedTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  meta?: any;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  emptyMessage?: string;
  rowsPerPageOptions?: number[];
}

export const PaginatedTable: React.FC<PaginatedTableProps> = ({
  columns,
  data,
  loading = false,
  meta,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage = "No data found",
  rowsPerPageOptions = [5, 10, 25, 50, 100],
}) => {
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage); // Backend uses 1-based indexing
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "textSecondary" }}>
            <Typography>{emptyMessage}</Typography>
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{
                      minWidth: column.minWidth,
                      bgcolor: "grey.100",
                      fontWeight: 600,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  hover
                  key={row.id || index}
                  sx={{ "&:last-child td": { border: 0 } }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align || "left"}>
                        {column.format ? column.format(value, row) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {meta && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={meta.total}
          rowsPerPage={meta.limit}
          page={meta.page - 1} // Convert to 0-based for MUI
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default PaginatedTable;

// import {
//   IconButton,
//   useTheme,
// } from "@mui/material";
// import {
//   KeyboardArrowLeft,
//   KeyboardArrowRight,
// } from "@mui/icons-material";

// interface PaginationActionsProps {
//   count: number;
//   page: number;
//   rowsPerPage: number;
//   onPageChange: (
//     event: React.MouseEvent<HTMLButtonElement>,
//     newPage: number
//   ) => void;
// }

// const PaginationActions = ({
//   count,
//   page,
//   rowsPerPage,
//   onPageChange,
// }: PaginationActionsProps) => {
//   const theme = useTheme();
//   const isRtl = theme.direction === "rtl";

//   return (
//     <>
//       <IconButton
//         onClick={(e) => onPageChange(e, page - 1)}
//         disabled={page === 0}
//       >
//         {isRtl ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
//       </IconButton>

//       <IconButton
//         onClick={(e) => onPageChange(e, page + 1)}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//       >
//         {isRtl ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
//       </IconButton>
//     </>
//   );
// };

