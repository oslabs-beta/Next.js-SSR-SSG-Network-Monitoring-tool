import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useMemo, useState, useEffect } from 'react'
// For resizing & auto sorting columns - Move to detail
import MaterialReactTable from 'material-react-table';
// Type import
import type { MRT_ColumnDef, MRT_Virtualizer } from 'material-react-table';
//Material-UI Imports
import {
  Box,
} from '@mui/material';
import { CellTower } from '@mui/icons-material'
// import chart.js & react-chartjs components
import { Chart, ChartType, registerables } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns';
// register chart.js elements due to webpack tree-shaking, else error
Chart.register(...registerables);

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // Hook for updating overall time and tying it to state
  // Time is determined by the difference between the final index's start+duration minus the initial index's start
  const [time, setTime] = useState(0);

  // Declare interface for typescript data type
  interface DATATYPE {
    'start-time': number;
    source: string;
    duration: number;
    'package-size': number;
    'status-code': number;
    endpoint: string;
    'request-type': string;
    'waterfall': any;
  }

  // Create sample data (but later on, format imported data)
  const data: DATATYPE[] = [
    {
      'start-time': 0,
      'source': 'codesmith',
      duration: 5000,
      'package-size': 10,
      'status-code': 200,
      endpoint: '/test0',
      'request-type': 'GET',
      waterfall: 0,
    },
    {
      'start-time': 5000,
      'source': 'codesmith',
      duration: 2000,
      'package-size': 20,
      'status-code': 200,
      endpoint: '/test1',
      'request-type': 'GET',
      waterfall: 1,
    },
    {
      'start-time': 7000,
      'source': 'austin',
      duration: 3000,
      'package-size': 30,
      'status-code': 200,
      endpoint: '/test2',
      'request-type': 'GET',
      waterfall: 2,
    },
    {
      'start-time': 10000,
      'source': 'thomas',
      duration: 4000,
      'package-size': 10,
      'status-code': 200,
      endpoint: '/test3',
      'request-type': 'GET',
      waterfall: 3,
    },
    {
      'start-time': 14000,
      'source': 'michael',
      duration: 1000,
      'package-size': 40,
      'status-code': 200,
      endpoint: '/test4',
      'request-type': 'GET',
      waterfall: 4,
    },
    {
      'start-time': 15000,
      'source': 'ben',
      duration: 6000,
      'package-size': 50,
      'status-code': 200,
      endpoint: '/test5',
      'request-type': 'GET',
      waterfall: 5,
    },
    {
      'start-time': 21000,
      'source': 'giles',
      duration: 7000,
      'package-size': 60,
      'status-code': 200,
      endpoint: '/test6',
      'request-type': 'GET',
      waterfall: 6,
    },
    {
      'start-time': 28000,
      'source': 'codesmith',
      duration: 2000,
      'package-size': 10,
      'status-code': 200,
      endpoint: '/test7',
      'request-type': 'GET',
      waterfall: 7,
    },
    {
      'start-time': 30000,
      'source': 'austin',
      duration: 3000,
      'package-size': 20,
      'status-code': 200,
      endpoint: '/test8',
      'request-type': 'GET',
      waterfall: 8,
    },
    {
      'start-time': 33000,
      'source': 'thomas',
      duration: 2000,
      'package-size': 30,
      'status-code': 200,
      endpoint: '/test9',
      'request-type': 'GET',
      waterfall: 9,
    },
    {
      'start-time': 35000,
      'source': 'michael',
      duration: 5000,
      'package-size': 40,
      'status-code': 200,
      endpoint: '/test10',
      'request-type': 'GET',
      waterfall: 10,
    },
    {
      'start-time': 40000,
      'source': 'ben',
      duration: 6000,
      'package-size': 50,
      'status-code': 200,
      endpoint: '/test11',
      'request-type': 'GET',
      waterfall: 11,
    },
    {
      'start-time': 46000,
      'source': 'giles',
      duration: 1000,
      'package-size': 60,
      'status-code': 200,
      endpoint: '/test12',
      'request-type': 'GET',
      waterfall: 12,
    },
    {
      'start-time': 47000,
      'source': 'codesmith',
      duration: 2000,
      'package-size': 10,
      'status-code': 200,
      endpoint: '/test13',
      'request-type': 'GET',
      waterfall: 13,
    },
    {
      'start-time': 49000,
      'source': 'austin',
      duration: 5000,
      'package-size': 20,
      'status-code': 200,
      endpoint: '/test14',
      'request-type': 'GET',
      waterfall: 14,
    },
    {
      'start-time': 54000,
      'source': 'thomas',
      duration: 1000,
      'package-size': 30,
      'status-code': 200,
      endpoint: '/test15',
      'request-type': 'GET',
      waterfall: 15,
    },
    {
      'start-time': 55000,
      'source': 'michael',
      duration: 5000,
      'package-size': 40,
      'status-code': 200,
      endpoint: '/test16',
      'request-type': 'GET',
      waterfall: 16,
    },
    {
      'start-time': 65000,
      'source': 'ben',
      duration: 1000,
      'package-size': 50,
      'status-code': 200,
      endpoint: '/test17',
      'request-type': 'GET',
      waterfall: 17,
    },
    {
      'start-time': 66000,
      'source': 'giles',
      duration: 2000,
      'package-size': 60,
      'status-code': 200,
      endpoint: '/test18',
      'request-type': 'GET',
      waterfall: 18,
    },
  ];

  // interface BARDATATYPE {
  //   label: string,
  //   data: number[],
  //   backgroundColor: string[],
  //   borderColor: string[],
  // }

  // const barDataSet: BARDATATYPE[] = [];

  // const innerData = [
  //   {
  //     x: [0, 5000],
  //     y: 1
  //   },
  //   {
  //     x: [0, 3000],
  //     y: 1
  //   }
  // ];

  // const innerData2 = [
  //   {
  //     x: [6000, 10000],
  //     y: 1
  //   },
  //   {
  //     x: [6000, 7000],
  //     y: 1
  //   }
  // ];

  // const innerData3 = [
  //   {
  //     x: [11000, 12000],
  //     y: 1
  //   },
  //   {
  //     x: [11000, 14000],
  //     y: 1
  //   }
  // ];

  const barDataSet = [
    // {
    //   label: '10',
    //   data: innerData,
    //   backgroundColor: ['green'],
    //   borderColor: ['limegreen']
    // },
    // {
    //   label: '20',
    //   data: innerData2,
    //   backgroundColor: ['green'],
    //   borderColor: ['limegreen']
    // },
    // {
    //   label: '/endpoint3',
    //   data: innerData3,
    //   backgroundColor: ['green'],
    //   borderColor: ['limegreen']
    // }
  ];


  for (let i = 0; i < data.length; i++) {
    barDataSet.push({
      label: [data[i]['endpoint']],
      data: [
        {
          x: [data[i]['start-time'], data[i]['start-time'] + data[i]['duration']],
          y: 1
        }
      ],
      backgroundColor: ['green'],
      borderColor: ['limegreen']
    })
  }

  // data for Bar chartjs component
  const barData = {
    labels: ['trace1'],
    datasets: barDataSet
  }

  // const barData = {
  //   labels: ['trace1', 'trace2', 'trace3'],
  //   datasets: barDataSet
  // }

  // Create columns -> later on, we can dynamically declare this based 
  // on user options using a config file or object or state and only
  // rendering the things that are requested

  //Column declaration requires a flat array of objects with a header
  // which is the column's title, and an accessorKey, which is the
  // key in the data object. 
  const columns = useMemo<MRT_ColumnDef<DATATYPE>[]>(
    () => [
      {
        header: 'Start',
        accessorKey: 'start-time',
      },
      {
        header: 'Source',
        accessorKey: 'source',
      },
      {
        header: 'Duration',
        accessorKey: 'duration',
      },
      {
        header: 'Size',
        accessorKey: 'package-size',
      },
      {
        header: 'Status',
        accessorKey: 'status-code',
      },
      {
        header: 'Endpoint',
        accessorKey: 'endpoint',
      },
      {
        header: 'Request',
        accessorKey: 'request-type',
      },
      {
        header: 'Waterfall',
        accessorKey: 'waterfall',
        enablePinning: true,
        minSize: 200, //min size enforced during resizing
        maxSize: 1000, //max size enforced during resizing
        size: 300, //medium column
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: 'green',
              borderRadius: '0.2rem',
              color: '#fff',
              // Proof of concept for the displays - these still must be tied to state.  We first select the 
              // cell, then determine the left and right portions and make it a percentage
              marginLeft: `${data[cell.getValue<number>()]['start-time'] / (data[data.length - 1]['start-time'] + data[data.length - 1]['duration']) * 100}%`,
              width: `${data[cell.getValue<number>()]['duration'] / (data[data.length - 1]['start-time'] + data[data.length - 1]['duration']) * 100}%`,
            })}
          >
            {/* below is the duration in seconds displayed as text in the waterfall bar */}
            {data[cell.getValue<number>()]['duration'] / 1000}
          </Box>
        ),
      }
    ],
    // WE ADDED DATA HERE, IF EVERYTHING IS BROKEN TRY DELETING THIS TO FIX IT?  
    [],
  );

  return (
    <>
      <Head>
        <title>DataTrace Dashboard</title>
        <meta name="description" content="DataTrace Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* REMEMBER TO CHANGE ICON AND FAVICON LTER */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.sidebar}>
          sidebar
        </div>
        <div className={styles.networkContainer}>
          <div className={styles.mainWaterfall}>
            {/* Bar component from react-chartjs with all options/plugins */}
            <Bar
              data={barData}
              // width={400}
              // height={200}
              options={{
                maintainAspectRatio: false,
                aspectRatio: 1,
                indexAxis: 'y',
                borderSkipped: false,
                borderWidth: 1,
                barPercentage: 0.1,
                categoryPercentage: 1,
                scales: {
                  x: {
                    position: 'top',
                    type: 'time',
                    // stacked: true,
                    grid: {
                      // display: false,
                      // drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      // autoSkip: true,
                      maxTicksLimit: 10,
                      callback: (value, index, values) => {
                        return `${value} ms`;
                      }
                    }
                  },
                  y: {
                    // beginAtZero: true,
                    stacked: true,
                    grid: {
                      display: false,
                      // drawBorder: false,
                      // drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false,
                  }
                },
              }}
            />
          </div>
          {/* Check if we can directly assign CSS to component names */}
          <div className={styles.detailList}>
            {/* Data is passed via data, column info passed via columns */}
            <MaterialReactTable
              columns={columns}
              data={data}
              defaultColumn={{
                minSize: 100, //allow columns to get smaller than default
                maxSize: 300, //allow columns to get larger than default
                size: 150, //make columns wider by default
              }}
              // enableRowSelection
              // enablePinning
              // initialState={{columnPinning:{right:['waterfall']}}}
              enablePagination={false}
              enableGlobalFilter={false}
              enableColumnResizing
              columnResizeMode='onEnd'
              layoutMode='grid'
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
        </div>
      </main>
    </>
  )
}