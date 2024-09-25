import React, { useEffect, useState } from 'react';
import AdminLayouts from '../../admincomponents/AdminLayouts';
import { useData } from '../../API/ApiContext';
import ChartComponent from '../../chart/ChartComponent';
import BarChart from '../../chart/BarChart';

const DataBox = ({ title, count, gradientFrom, gradientTo, svgPath }) => {
  return (
    <div className={`shadow-lg rounded-md p-5 bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center`}>
      <div className="flex-shrink-0">
        <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={svgPath} />
        </svg>
      </div>
      <div className="ml-5 flex-1">
        <h5 className="text-white text-lg font-medium mb-1">{title}</h5>
        <p className="text-white text-3xl font-semibold">{count}</p>
      </div>
    </div>
  );
};

const AdminHome = () => {
  const { StateJobAPI } = useData()
  const [defaultStats, setdefaultStats] = useState([])
  const [monthlyApplications, setmonthlyApplications] = useState([])

  const getstatejob = async () => {
    const res = await StateJobAPI()
    if (res.success) {
      const { data } = res;
      // console.log(data)
      console.log(defaultStats);
      console.log(monthlyApplications);
      setdefaultStats(data.data.defaultStats)
      setmonthlyApplications(data.data.monthlyApplications)
    } else {
      console.error(res.message || res.error);
    }
  }

  useEffect(() => {
    getstatejob();
  }, []);

  const totalApplications = monthlyApplications.reduce((acc, app) => acc + app.count, 0);

  return (
    <AdminLayouts>
      <div className="mt-12">
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

          {/* Total Applications DataBox */}
          <DataBox
            title="Total Applications"
            count={totalApplications || '0'}
            gradientFrom="from-blue-600"
            gradientTo="to-blue-400"
            svgPath="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75zM2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"
          />

          {/* Pending Applications DataBox */}
          <DataBox
            title="Pending Applications"
            count={defaultStats.Pending || '0'}
            gradientFrom="from-pink-600"
            gradientTo="to-pink-400"
            svgPath="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
          />

          {/* Interviews Scheduled DataBox */}
          <DataBox
            title="Interviews Scheduled"
            count={defaultStats.Interview || '0'}
            gradientFrom="from-green-600"
            gradientTo="to-green-400"
            svgPath="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />

          {/* Jobs Declined DataBox */}
          <DataBox
            title="Jobs Declined"
            count={defaultStats.Declined || '0'}
            gradientFrom="from-orange-600"
            gradientTo="to-orange-400"
            svgPath="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"
          />
        </div>

        {/* Chart */}
        <div className="p-4 flex justify-center">
          {/* <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Monthly Applications</h1>
            <ChartComponent monthlyApplications={monthlyApplications} />
          </div> */}
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Application Status</h1>
            <BarChart defaultStats={defaultStats} />
          </div>
        </div>

      </div>
    </AdminLayouts>
  );
};

export default AdminHome;