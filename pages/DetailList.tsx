"use client";
import styles from "@/styles/DetailList.module.css";
import MaterialReactTable from "material-react-table"; // For resizing & auto sorting columns - Move to detail
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function DetailList(props: any) {

    return (
        <div className={styles.detailList}>
            {/* Data is passed via data, column info passed via columns */}
            <MaterialReactTable
            columns={props.columns}
            data={props.data}
            defaultColumn={{
                minSize: 50, //allow columns to get smaller than default
                maxSize: 300, //allow columns to get larger than default
                size: 70, //make columns wider by default
            }}
            // enableRowSelection
            // enablePinning
            // initialState={{columnPinning:{right:['waterfall']}}}
            enablePagination={false}
            enableGlobalFilter={false}
            enableColumnResizing
            columnResizeMode="onEnd"
            layoutMode="grid"
            enableStickyHeader={true}
            // enableRowVirtualization
            // onSortingChange={setSorting}
            // state={{ isLoading, sorting }}
            // rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //optional
            // rowVirtualizerProps={{ overscan: 5 }} //optionally customize the row virtualizer
            // columnVirtualizerProps={{ overscan: 2 }}
            // muiTableHeadCellProps={{
            //   sx: {
            //     flex: '0 0 auto',
            //   },
            // }}
            // muiTableBodyCellProps={{
            //   sx: {
            //     flex: '0 0 auto',
            //   },
            // }}
            />
        </div>
    )
}