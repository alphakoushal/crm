import React,{useRef,useEffect,useCallback,useState} from "react";
import Header from "../component/Header";
import Fetchdata from "../services/fetchdata";
import Chart from 'react-apexcharts'
import format from 'date-fns/format';
import { addDays} from 'date-fns';
import DateRangePickerComponent from "../component/Daterangepicker";
const Useranalytics = () => {
     const platform = useRef("anuation");
     let Daterangepicker = useRef({startDate:new Date(),endDate:addDays(new Date(), 7)});
     const auth = JSON.parse(localStorage.getItem("user"));
     const [analyticdata,setanalyticdata] = useState({scheduleemail:[],sentemail:[]});
     const activeheader = useRef("user-analytics");
     const setDaterangepicker = (data) => {
        Daterangepicker.current = data;
                 fetchanalyticdata();
            fetchschedulcron();
  }
     const fetchschedulcron =useCallback(async()=>{ 
      try
      {
         const fetchdata = await Fetchdata.fetchusernanlytic({posttype:'scheduled_mails','userid':auth.userid,'startdate':format(Daterangepicker.current.startDate,'yyyy-MM-dd'),'enddate':format(Daterangepicker.current.endDate,'yyyy-MM-dd')});
     if(fetchdata.data.success){
            setanalyticdata(prevData => ({...prevData,scheduleemail:fetchdata.data.data[auth.userid]}));
        }
      }catch(e){
        console.log(e);
      }
        },[]);
     const fetchanalyticdata =useCallback(async()=>{ 
      try
      {
         const fetchdata = await Fetchdata.fetchusernanlytic({posttype:'getpast_mail_sents','userid':auth.userid,'startdate':format(Daterangepicker.current.startDate,'yyyy-MM-dd'),'enddate':format(Daterangepicker.current.endDate,'yyyy-MM-dd')});
     if(fetchdata.data.success){
        setanalyticdata(prevData => ({...prevData,sentemail:fetchdata.data.data[auth.userid]}));
        }
      }
      catch(e){
        console.log(e);
      }
        },[]);
        useEffect(()=>{ 
            fetchanalyticdata();
            fetchschedulcron();
        },[Daterangepicker]);
        useEffect(()=>{
        },[analyticdata]); 
    return (
        <>
                <Header
          platform={platform}
          changedata={false}
          except={true}
          completedata={[]}
          alldata={[]}
          showmailbox={false}
          showdupemailbox={false}
          showcronbox={false}
          clearfilters={false}
          refreshdata={false}
          formdatas={false}
          showcurrencies={false}
        ></Header>
              <div class="body-wrapper">
               
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-8 d-flex align-items-stretch">
              <div class="card w-100 bg-primary-subtle  shadow-none">
                <div class="card-body position-relative">
                   
                  <div class="row">
                    
                    <div class="col-sm-8">
                      <div class="d-flex align-items-center mb-7">
                        <div class="rounded-circle overflow-hidden me-6">
                          <img src={"../crm/assets/images/profile/"+(auth.gender=='f' ? 'user-2' : 'user-1')+".jpg"} alt="modernize-img" width="40" height="40"/>
                        </div>
                        <h5 class="fw-semibold mb-0 fs-5">Welcome back {auth?.name}</h5>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="border-end pe-4 border-muted border-opacity-10">
                          <h3 class="mb-1 fw-semibold fs-8 d-flex align-content-center">{analyticdata?.sentemail?.other?.total_apps}<i class="ti ti-mail fs-5 lh-base"></i>
                          </h3>
                          <p class="mb-0 text-dark">Total Emails</p>
                        </div>
                        <div class=" ps-4 border-end pe-4 border-muted border-opacity-10">
                          <h3 class="mb-1 fw-semibold fs-8 d-flex align-content-center">{analyticdata?.sentemail?.other?.total_sent}<i class="ti ti-mail fs-5 lh-base"></i><i class="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                          </h3>
                          <p class="mb-0 text-dark">Sent Emails</p>
                        </div>
                        <div class=" ps-4 border-end pe-4 border-muted border-opacity-10">
                          <h3 class="mb-1 fw-semibold fs-8 d-flex align-content-center">{analyticdata?.sentemail?.other?.total_pending}<i class="ti ti-mail fs-5 lh-base"></i><i class="ti ti-arrow-up-right fs-5 lh-base text-warning"></i>
                          </h3>
                          <p class="mb-0 text-dark">Pending Emails</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-4">
                      <DateRangePickerComponent setDaterangepicker={setDaterangepicker}></DateRangePickerComponent>
                      <div class="welcome-bg-img mb-n7 text-end">
                        <img src={"../crm/assets/images/backgrounds/welcome-bg.svg"} alt="modernize-img" class="img-fluid"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-lg-2 d-flex align-items-stretch">
              <div class="card w-100">
                <div class="card-body p-4">
                  <h4 class="fw-semibold">0</h4>
                  <p class="mb-2 fs-3">Total Cron</p>
                  <Chart id="totalcron" options={{
    chart: {
      type: "donut",
    },
    legend: {
        show: false,
    },

    stroke: {
        show: false,
    },
     tooltip: {
      style: {
        fontSize: '14px',
      },
    },
    plotOptions: {
        pie: {
            donut: {
                size: "70%",
                background: "none",
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: "18px",
                        color: undefined,
                        offsetY: -10,
                    },
                    value: {
                        show: false,
                        color: "#98aab4",
                    },
                },
            },
        },
    },
    labels: ["LB", "Ringing", "Callback"],
        dataLabels: {
        enabled: false,
        style: {
        fontSize: '12px',
      },
    },
  }} series={[60, 25, 15]} height={110} type="donut" />
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-lg-2 d-flex align-items-stretch">
              <div class="card w-100">
                <div class="card-body p-4">
                  <h4 class="fw-semibold">0</h4>
                  <p class="mb-1 fs-3">Total Cron</p>
                  <Chart id="sales" options={{
        chart: {
            type: 'bar',
            width: '100%',
            stacked: true,
            stackType: '100%',
            fontFamily: "inherit",
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: true
            }
        },
        colors: ["#5d87ff", "#49beff", "#eaeff4"],
        grid: {
            show: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: [3],
                borderRadiusApplication: 'around',
                borderRadiusWhenStacked: 'around',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: false,
            width: 1,
            colors: ['rgba(0,0,0,0.01)']
        },
        xaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        axisBorder: {
            show: false
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            }
        },
    }} series={[
        {
            name: "",
            data: [25, 35, 20, 25, 40, 25],
        },
        {
            name: "",
            data: [35, 40, 20, 35, 40, 35],
        },
        {
            name: "",
            data: [40, 25, 60, 40, 20, 40],
        },
    ]} type='bar' height="85"></Chart>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 d-flex align-items-stretch">
              <div class="card w-100">
                <div class="card-body">
                  <h4 class="card-title fw-semibold">Account used</h4>
                  <p class="card-subtitle mb-4">Total Email Sent per account</p>
                  <div class="d-flex align-items-center">
                    {Object.keys(analyticdata?.sentemail?.account ?? {}).map((value,index)=>{
                    return <div class="me-4">
                    <span class="round-8 text-bg-primary rounded-circle me-2 d-inline-block"></span>
                    <span class="fs-2">{value}</span>
                  </div>
                    })
                }


                  </div>
                  <div id="revenue-chart" class="revenue-chart mx-n3"><Chart options={{
    chart: { id: "bar-chart" },
    xaxis: { categories: Object.keys(analyticdata?.sentemail?.account ?? {}) },
  }} series={[{ name: "Sales", data: Object.values(analyticdata?.sentemail?.account ?? {}).map((value,index)=> value.success) }]} type="bar" /></div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 d-flex align-items-stretch">
              <div class="card w-100">
                <div class="card-body">
                  <h4 class="card-title fw-semibold">Cron Overview</h4>
                  <p class="card-subtitle mb-2">Current scheduled Emails</p>
                  <div id="revenue-chart" class="revenue-chart mx-n3"><Chart options={{
    chart: { id: "bar-chart" },
    xaxis: { categories: ['Total Emails','Sent Emails'] },
  }} series={[{ name: "Sales", data: [Object.values(analyticdata?.scheduleemail?.account ?? {}).map((value,index)=> value.total).reduce((acc, num)=>acc+num,0),Object.values(analyticdata?.scheduleemail?.account ?? {}).map((value,index)=> value.success).reduce((acc, num)=>acc+num,0)] }]} type="bar" /></div>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary-subtle text-primary rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                        <i class="ti ti-grid-dots fs-3"></i>
                      </div>
                      <div>
                        <h6 class="fw-semibold text-dark fs-3 mb-0">{Object.values(analyticdata?.scheduleemail?.account ?? {}).map((value,index)=> value.pending_crons).reduce((acc, num)=>acc+num,0)}</h6>
                        <p class="fs-2 mb-0 fw-normal">Pending</p>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <div class="bg-secondary-subtle text-secondary rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                        <i class="ti ti-grid-dots fs-3"></i>
                      </div>
                      <div>
                        <h6 class="fw-semibold text-dark fs-3 mb-0">{Object.values(analyticdata?.scheduleemail?.account ?? {}).map((value,index)=> value.inprocess_crons).reduce((acc, num)=>acc+num,0)}</h6>
                        <p class="fs-2 mb-0 fw-normal">Inprocess</p>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <div class="bg-secondary-subtle text-secondary rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                        <i class="ti ti-grid-dots fs-3"></i>
                      </div>
                      <div>
                        <h6 class="fw-semibold text-dark fs-3 mb-0">{Object.values(analyticdata?.scheduleemail?.account ?? {}).map((value,index)=> value.completed_crons).reduce((acc, num)=>acc+num,0)}</h6>
                        <p class="fs-2 mb-0 fw-normal">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="row">
                <div class="col-sm-6 d-flex align-items-stretch">
                  <div class="card w-100">
                    <div class="card-body">
                      <div class="p-2 bg-primary-subtle rounded-2 d-inline-block mb-3">
                      <i class="ti ti-mail fs-5 lh-base"></i>
                      </div>
                      <Chart options={{
        chart: {
            type: 'bar',
            fontFamily: "inherit",
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: true
            }
        },
        colors: ["var(--bs-primary)"],
        grid: {
            show: false
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '100%',
                borderRadius: 4,
                distributed: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 3,
            colors: ['rgba(0,0,0,0.01)']
        },
        xaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        axisBorder: {
            show: false
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            }
        },
    }} series={[
        {
            name: "",
            data: [100, 60, 35, 90, 35, 100]
        },
    ]} type="bar" height={25} />
                      <div id="sales-two" class="mb-3 mx-n4"></div>
                      <h4 class="mb-1 fw-semibold d-flex align-content-center">0<i class="ti ti-arrow-up-right fs-5 text-success"></i>
                      </h4>
                      <p class="mb-0">Total Cron</p>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 d-flex align-items-stretch">
                  <div class="card w-100">
                    <div class="card-body">
                      <div class="p-2 bg-info-subtle rounded-2 d-inline-block mb-3">
                      <i class="ti ti-mail fs-5 lh-base"></i>
                      </div>
                     <Chart options={{
        chart: {
            id: "growth",
            type: "area",
            sparkline: {
                enabled: true,
            },
            group: "growth",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            colors: ["#5d87ff"],
            type: "solid",
            opacity: 0,
        },

        markers: {
            size: 0,
        },
        tooltip: {
            enabled: false,
        },
                     }} series={[
                        {
                            colors: ["#5d87ff"],
                            data: [0, 10, 10, 10, 35, 45, 30, 30, 30, 50, 52, 30, 25, 45, 50, 80, 60, 65]
                        },
                    ]} type="area" height={25} />
                      <h4 class="mb-1 fw-semibold d-flex align-content-center">0%<i class="ti ti-arrow-up-right fs-5 text-success"></i>
                      </h4>
                      <p class="mb-0">Total Cron</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="row alig n-items-start">
                    <div class="col-8">
                      <h4 class="card-title mb-9 fw-semibold"> Monthly Total Cron </h4>
                      <div class="d-flex align-items-center mb-3">
                        <h4 class="fw-semibold mb-0 me-8">0</h4>
                        <div class="d-flex align-items-center">
                          <span class="me-2 rounded-circle bg-success-subtle text-success round-20 d-flex align-items-center justify-content-center">
                            <i class="ti ti-arrow-up-left"></i>
                          </span>
                          <p class="text-dark me-1 fs-3 mb-0">+0%</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="d-flex justify-content-end">
                        <div class="p-2 bg-primary-subtle rounded-2 d-inline-block">
                        <i class="ti ti-mail fs-5 lh-base"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Chart options={{
        chart: {
            id: "monthly-earning",
            type: "area",
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0,
                inverseColors: false,
                opacityFrom: 0.10,
                opacityTo: 0,
                stops: [20, 180],
            },
        },


        markers: {
            size: 0,
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: true,
                position: "right",
            },
            x: {
                show: false,
            },
        },
    }} series={[
        {
            name: 'monthly earnings',
            color: "var(--bs-primary)",
            data: [25, 66, 20, 40, 12, 58, 20],
        },
    ]} type="area" height={56} />
                  <div id="monthly-earning"></div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 d-flex align-items-stretch d-none">
              <div class="card w-100">
                <div class="card-body">
                  <h4 class="card-title fw-semibold">Weekly Stats</h4>
                  <p class="card-subtitle mb-0">Average sales</p>
                  <div id="weekly-stats" class="mb-4 mt-7"></div>
                  <div class="position-relative">
                    <div class="d-flex align-items-center justify-content-between mb-4">
                      <div class="d-flex">
                        <div class="p-6 bg-primary-subtle text-primary rounded-2 me-6 d-flex align-items-center justify-content-center">
                          <i class="ti ti-grid-dots fs-6"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 fs-4 fw-semibold">Top Sales</h6>
                          <p class="fs-3 mb-0">Johnathan Doe</p>
                        </div>
                      </div>
                      <div class="bg-primary-subtle text-primary badge">
                        <p class="fs-3 fw-semibold mb-0">+68</p>
                      </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-4">
                      <div class="d-flex">
                        <div class="p-6 bg-success-subtle text-success rounded-2 me-6 d-flex align-items-center justify-content-center">
                          <i class="ti ti-grid-dots fs-6"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 fs-4 fw-semibold">Best Seller</h6>
                          <p class="fs-3 mb-0">Footware</p>
                        </div>
                      </div>
                      <div class="bg-success-subtle text-success badge">
                        <p class="fs-3 fw-semibold mb-0">+68</p>
                      </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex">
                        <div class="p-6 bg-danger-subtle text-danger rounded-2 me-6 d-flex align-items-center justify-content-center">
                          <i class="ti ti-grid-dots fs-6"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 fs-4 fw-semibold">Most Commented</h6>
                          <p class="fs-3 mb-0">Fashionware</p>
                        </div>
                      </div>
                      <div class="bg-danger-subtle text-danger badge">
                        <p class="fs-3 fw-semibold mb-0">+68</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 d-flex align-items-stretch d-none">
              <div class="card w-100">
                <div class="card-body">
                  <div>
                    <h4 class="card-title fw-semibold">Yearly Sales</h4>
                    <p class="card-subtitle">Every month</p>
                    <div id="salary" class="mb-7 pb-8 mx-n4"></div>
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div class="bg-primary-subtle text-primary rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                          <i class="ti ti-grid-dots fs-6"></i>
                        </div>
                        <div>
                          <p class="fs-3 mb-0 fw-normal">Total Sales</p>
                          <h6 class="fw-semibold text-dark fs-4 mb-0">$36,358</h6>
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="bg-light-subtle text-muted rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                          <i class="ti ti-grid-dots fs-6"></i>
                        </div>
                        <div>
                          <p class="fs-3 mb-0 fw-normal">Expenses</p>
                          <h6 class="fw-semibold text-dark fs-4 mb-0">$5,296</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 d-flex align-items-stretch d-none">
              <div class="card w-100">
                <div class="card-body">
                  <h4 class="card-title fw-semibold">Payment Gateways</h4>
                  <p class="card-subtitle mb-7">Platform for Income</p>
                  <div class="position-relative">
                    <div class="d-flex align-items-center justify-content-between mb-4">
                      <div class="d-flex">
                        <div class="p-8 bg-primary-subtle rounded-2 d-flex align-items-center justify-content-center me-6">
                          <img src="../assets/images/svgs/icon-paypal2.svg" alt="modernize-img" class="img-fluid" width="24" height="24"/>
                        </div>
                        <div>
                          <h6 class="mb-1 fs-4 fw-semibold">PayPal</h6>
                          <p class="fs-3 mb-0">Big Brands</p>
                        </div>
                      </div>
                      <h6 class="mb-0 fw-semibold">+$6,235</h6>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-4">
                      <div class="d-flex">
                        <div class="p-8 bg-success-subtle rounded-2 d-flex align-items-center justify-content-center me-6">
                          <img src="../assets/images/svgs/icon-wallet.svg" alt="modernize-img" class="img-fluid" width="24" height="24"/>
                        </div>
                        <div>
                          <h6 class="mb-1 fs-4 fw-semibold">Wallet</h6>
                          <p class="fs-3 mb-0">Bill payment</p>
                        </div>
                      </div>
                      <h6 class="mb-0 fw-semibold text-muted">+$345</h6>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-4">
                      <div class="d-flex">
                        <div class="p-8 bg-warning-subtle rounded-2 d-flex align-items-center justify-content-center me-6">
                          <img src="../assets/images/svgs/icon-credit-card.svg" alt="modernize-img" class="img-fluid" width="24" height="24"/>
                        </div>
                        <div>
                          <h6 class="mb-1 fs-4 fw-semibold">Credit card</h6>
                          <p class="fs-3 mb-0">Money reversed</p>
                        </div>
                      </div>
                      <h6 class="mb-0 fw-semibold">+$2,235</h6>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-7 pb-1">
                      <div class="d-flex">
                        <div class="p-8 bg-danger-subtle rounded-2 d-flex align-items-center justify-content-center me-6">
                          <img src="../assets/images/svgs/icon-pie2.svg" alt="modernize-img" class="img-fluid" width="24" height="24"/>
                        </div>
                        <div>
                          <h6 class="mb-1 fs-4 fw-semibold">Refund</h6>
                          <p class="fs-3 mb-0">Bill payment</p>
                        </div>
                      </div>
                      <h6 class="mb-0 fw-semibold text-muted">-$32</h6>
                    </div>
                  </div>
                  <button class="btn btn-outline-primary w-100">View all transactions</button>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 d-flex align-items-stretch d-none">
              <div class="card w-100">
                <div class="card-body">
                  <div class="mb-4">
                    <h4 class="card-title fw-semibold">Recent Transactions</h4>
                    <p class="card-subtitle">How to Secure Recent Transactions</p>
                  </div>
                  <ul class="timeline-widget mb-0 position-relative mb-n5">
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">09:30</div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-primary flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1">Payment received from John Doe of $385.90</div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">10:00 am</div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-info flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">New sale recorded <a href="javascript:void(0)" class="text-primary d-block fw-normal ">#ML-3467</a>
                      </div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">12:00 am</div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-success flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1">Payment was made of $64.95 to Michael</div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">09:30 am</div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-warning flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">New sale recorded <a href="javascript:void(0)" class="text-primary d-block fw-normal ">#ML-3467</a>
                      </div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">09:30 am</div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-danger flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">New arrival recorded <a href="javascript:void(0)" class="text-primary d-block fw-normal ">#ML-3467</a>
                      </div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">12:00 am</div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-success flex-shrink-0 my-8"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1">Payment Done</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-12 col-lg-8 d-flex align-items-stretch d-none">
              <div class="card w-100">
                <div class="card-body">
                  <div class="d-sm-flex d-block align-items-center justify-content-between mb-3">
                    <div class="mb-3 mb-sm-0">
                      <h4 class="card-title fw-semibold">Product Performances</h4>
                      <p class="card-subtitle">What Impacts Product Performance?</p>
                    </div>
                    <div>
                      <select class="form-select fw-semibold">
                        <option value="1">March 2024</option>
                        <option value="2">April 2024</option>
                        <option value="3">May 2024</option>
                        <option value="4">June 2024</option>
                      </select>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <table class="table align-middle text-nowrap mb-0">
                      <thead>
                        <tr class="text-muted fw-semibold">
                          <th scope="col" class="ps-0">Assigned</th>
                          <th scope="col">Progress</th>
                          <th scope="col">Priority</th>
                          <th scope="col">Budget</th>
                          <th scope="col">Chart</th>
                        </tr>
                      </thead>
                      <tbody class="border-top">
                        <tr>
                          <td class="ps-0">
                            <div class="d-flex align-items-center">
                              <div class="me-2 pe-1">
                                <img src="../assets/images/products/product-1.jpg" class="rounded-2" width="48" height="48" alt="modernize-img" />
                              </div>
                              <div>
                                <h6 class="fw-semibold mb-1">Minecraf App</h6>
                                <p class="fs-2 mb-0 text-muted">Jason Roy</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="mb-0 fs-3 text-dark">73.2%</p>
                          </td>
                          <td>
                            <span class="badge fw-semibold py-1 w-85 bg-success-subtle text-success">Low</span>
                          </td>
                          <td>
                            <p class="fs-3 text-dark mb-0">$3.5k</p>
                          </td>
                          <td>
                            <div id="table-chart"></div>
                          </td>
                        </tr>
                        <tr>
                          <td class="ps-0">
                            <div class="d-flex align-items-center">
                              <div class="me-2 pe-1">
                                <img src="../assets/images/products/product-2.jpg" class="rounded-2" width="48" height="48" alt="modernize-img" />
                              </div>
                              <div>
                                <h6 class="fw-semibold mb-1">Web App Project</h6>
                                <p class="fs-2 mb-0 text-muted">Mathew Flintoff</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="mb-0 fs-3 text-dark">56.8%</p>
                          </td>
                          <td>
                            <span class="badge fw-semibold py-1 w-85 bg-warning-subtle text-warning">Medium</span>
                          </td>
                          <td>
                            <p class="fs-3 text-dark mb-0">$3.5k</p>
                          </td>
                          <td>
                            <div id="table-chart-1"></div>
                          </td>
                        </tr>
                        <tr>
                          <td class="ps-0">
                            <div class="d-flex align-items-center">
                              <div class="me-2 pe-1">
                                <img src="../assets/images/products/product-3.jpg" class="rounded-2" width="48" height="48" alt="modernize-img" />
                              </div>
                              <div>
                                <h6 class="fw-semibold mb-1">Modernize Dashboard</h6>
                                <p class="fs-2 mb-0 text-muted">Anil Kumar</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="mb-0 fs-3 text-dark">25%</p>
                          </td>
                          <td>
                            <span class="badge fw-semibold py-1 w-85 bg-info-subtle text-info">Very high</span>
                          </td>
                          <td>
                            <p class="fs-3 text-dark mb-0">$3.5k</p>
                          </td>
                          <td>
                            <div id="table-chart-2"></div>
                          </td>
                        </tr>
                        <tr>
                          <td class="ps-0 border-bottom-0">
                            <div class="d-flex align-items-center">
                              <div class="me-2 pe-1">
                                <img src="../assets/images/products/product-4.jpg" class="rounded-2" width="48" height="48" alt="modernize-img" />
                              </div>
                              <div>
                                <h6 class="fw-semibold mb-1">Dashboard Co</h6>
                                <p class="fs-2 mb-0 text-muted">George Cruize</p>
                              </div>
                            </div>
                          </td>
                          <td class="border-bottom-0">
                            <p class="mb-0 fs-3 text-dark">96.3%</p>
                          </td>
                          <td class="border-bottom-0">
                            <span class="badge fw-semibold py-1 w-85 bg-danger-subtle text-danger">High</span>
                          </td>
                          <td class="border-bottom-0">
                            <p class="fs-3 text-dark mb-0">$3.5k</p>
                          </td>
                          <td class="border-bottom-0">
                            <div id="table-chart-3"></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
    );
    }

    export default Useranalytics;