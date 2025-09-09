import React, { useState, useRef, useCallback, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Chart from "react-apexcharts";
import Fetchdata from "../../../services/fetchdata";
import DateRangePickerComponent from "../../Daterangepicker";
import format from "date-fns/format";
import { addDays } from "date-fns";
import {
  emailstatus,
  callstatus,
  defaultvalue,
} from "../../../constant/Constant";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
const Datanalyticsidebar = ({ data, showanalyticsidebar }) => {
  const [open, setOpen] = useState({ status: false, message: "" });
  const [option, setOption] = useState(null);
  const [analyticdata, setanalyticdata] = useState({
    scheduleemail: [],
    sentemail: [],
  });
  let Daterangepicker = useRef({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
  });
  const statusCounts = data.reduce(
    (acc, item) => {
      const e_m = emailstatus[item[23]] ?? "";
      const c_l = callstatus[item[24]] ?? "";
      if (e_m && e_m.trim() !== "") {
        acc.email[e_m] = (acc.email[e_m] || 0) + 1;
      }
      if (c_l && c_l.trim() !== "") {
        acc.call[c_l] = (acc.call[c_l] || 0) + 1;
      }
      return acc;
    },
    {
      email: {},
      call: {},
    }
  );

  const emailLabels = Object.keys(statusCounts.email);
  const emailSeries = Object.values(statusCounts.email);

  const callLabels = Object.keys(statusCounts.call);
  const callSeries = Object.values(statusCounts.call);
  const auth = JSON.parse(localStorage.getItem("user"));
  const setDaterangepicker = (data) => {
    Daterangepicker.current = data;
    fetchanalyticdata();
    fetchschedulcron();
  };
  const fetchschedulcron = useCallback(async () => {
    try {
      const fetchdata = await Fetchdata.fetchusernanlytic({
        posttype: "scheduled_mails",
        userid: auth.userid,
        startdate: format(Daterangepicker.current.startDate, "yyyy-MM-dd"),
        enddate: format(Daterangepicker.current.endDate, "yyyy-MM-dd"),
      });
      if (fetchdata.data.success) {
        setanalyticdata((prevData) => ({
          ...prevData,
          scheduleemail: fetchdata.data.data[auth.userid],
        }));
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  const fetchanalyticdata = useCallback(async () => {
    try {
      const fetchdata = await Fetchdata.fetchusernanlytic({
        posttype: "getpast_mail_sents",
        userid: auth.userid,
        startdate: format(Daterangepicker.current.startDate, "yyyy-MM-dd"),
        enddate: format(Daterangepicker.current.endDate, "yyyy-MM-dd"),
      });
      if (fetchdata.data.success) {
        setanalyticdata((prevData) => ({
          ...prevData,
          sentemail: fetchdata.data.data[auth.userid],
        }));
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    fetchanalyticdata();
    fetchschedulcron();
  }, [Daterangepicker]);
  useEffect(() => {
    document.querySelector(".uploadanalyticsidebar").classList.add("show");
  }, [analyticdata]);

  function handleClose() {
    setOpen({ status: false, message: "" });
  }
  const closebar = async (e) => {
    e.preventDefault();
    let exit = document
      .querySelector(".body-wrapper1")
      .classList.contains("loader");
    if (!exit) {
      document.querySelector(".uploadanalyticsidebar").classList.remove("show");
      showanalyticsidebar(false);
    }
  };
  const fetchMap = async (v, type) => {
    try {
      const res = await fetch("/crm/world.json");
      const geoJson = await res.json();
      echarts.registerMap("world", geoJson);
      let countryCounts = [];
      if (type == "email") {
        countryCounts = data.reduce((acc, code) => {
          const country =
            code[3] && code[23] !== "" && (v == "All" || v == code[24])
              ? defaultvalue.countriescode[code[3]]?.name ?? code[3]
              : "";
          if (country) acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});
        console.log(v, type, countryCounts);
      } else {
        countryCounts = data.reduce((acc, code) => {
          const countryCode = defaultvalue.phoneextension(code[13], code[3]);
          const country =
            code[3] && code[24] !== "" && (v == "All" || v == code[24])
              ? defaultvalue.phoneCodeToCountry[countryCode]?.name ??
                countryCode
              : "";
          if (country) acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});
      }
      const chartData = Object.entries(countryCounts).map(([name, value]) => ({
        name,
        value,
      }));
      console.log(chartData);
      // Step 4: Set chart options
      setOption(
        chartData.length === 0
          ? {
              graphic: {
                type: "text",
                left: "center",
                top: "middle",
                style: {
                  text: "No data available",
                  fontSize: 18,
                  fill: "#999",
                },
              },
    series: [],
    visualMap: null,
            }
          : {
              tooltip: {
                trigger: "item",
                formatter: "Country: {b} </br> Total:{c}",
              },
              visualMap: {
                min: 0,
                max: Math.max(...chartData.map((d) => d.value)),
                text: ["High", "Low"],
                left: "left",
                bottom: "5%",
                inRange: {
                  color: ["#d2f5ef", "#007acc"],
                },
                calculable: true,
              },
              series: [
                {
                  name: "Submissions",
                  type: "map",
                  map: "world",
                  roam: false,
                  emphasis: {
                    label: { show: true },
                  },
                  data: chartData,
                },
              ],
            }
      );
    } catch (err) {
      console.error("Failed to load map data:", err);
    }
  };
  const filtercountrystats = (e, type) => {
    const selectedValue = e.target.value;
    if (selectedValue === "_blank") {
      fetchMap("All", type);
    } else {
      fetchMap(selectedValue, type);
    }
  };
  useEffect(() => {
    fetchMap("All", "call");
  }, []);
  return (
    <>
      <Snackbar
        open={open.status}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert elevation={6} variant="filled">
          {open.message}
        </MuiAlert>
      </Snackbar>
      <div
        className="offcanvas offcanvas-end analyitc-cart uploadanalyticsidebar"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header py-4">
          <h5
            className="offcanvas-title fs-5 fw-semibold"
            id="offcanvasRightLabel"
          >
            Data Analytics Update
          </h5>
          <a
            onClick={(e) => closebar(e)}
            className="btn btn-outline-primary w-30"
          >
            Close
          </a>
        </div>
        <div className="offcanvas-body h-100 px-4 pt-0" data-simplebar>
          <div class="row">
            <div class="col-lg-8 d-flex align-items-stretch">
              <div class="card w-100 bg-primary-subtle  shadow-none">
                <div class="card-body position-relative">
                  <div class="row">
                    <div class="col-sm-8">
                      <div class="d-flex align-items-center mb-7">
                        <div class="rounded-circle overflow-hidden me-6">
                          <img
                            src={
                              "../crm/assets/images/profile/" +
                              (auth.gender == "f" ? "user-2" : "user-1") +
                              ".jpg"
                            }
                            alt="modernize-img"
                            width="40"
                            height="40"
                          />
                        </div>
                        <h5 class="fw-semibold mb-0 fs-5">
                          Welcome back {auth?.name}
                        </h5>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="border-end pe-4 border-muted border-opacity-10">
                          <h3 class="mb-1 fw-semibold fs-8 d-flex align-content-center">
                            {analyticdata?.sentemail?.other?.total_apps}
                            <i class="ti ti-mail fs-5 lh-base"></i>
                          </h3>
                          <p class="mb-0 text-dark">Total Emails</p>
                        </div>
                        <div class=" ps-4 border-end pe-4 border-muted border-opacity-10">
                          <h3 class="mb-1 fw-semibold fs-8 d-flex align-content-center">
                            {analyticdata?.sentemail?.other?.total_sent}
                            <i class="ti ti-mail fs-5 lh-base"></i>
                            <i class="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                          </h3>
                          <p class="mb-0 text-dark">Sent Emails</p>
                        </div>
                        <div class=" ps-4 border-end pe-4 border-muted border-opacity-10">
                          <h3 class="mb-1 fw-semibold fs-8 d-flex align-content-center">
                            {analyticdata?.sentemail?.other?.total_pending}
                            <i class="ti ti-mail fs-5 lh-base"></i>
                            <i class="ti ti-arrow-up-right fs-5 lh-base text-warning"></i>
                          </h3>
                          <p class="mb-0 text-dark">Pending Emails</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-4">
                      <DateRangePickerComponent
                        setDaterangepicker={setDaterangepicker}
                      ></DateRangePickerComponent>

                      <div class="welcome-bg-img mb-n7 text-end">
                        <img
                          src={
                            "../crm/assets/images/backgrounds/welcome-bg.svg"
                          }
                          alt="modernize-img"
                          class="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-lg-4 d-flex align-items-stretch">
              <div class="card w-100">
                <div class="card-body p-4">
                  <p class="mb-2 fs-3">Email Status</p>
                  <Chart
                    id="emailstatus"
                    options={{
                      chart: {
                        type: "bar",
                        height: 250,
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 4,
                          borderRadiusApplication: "end",
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                      xaxis: {
                        categories: emailLabels, // dynamically assigned labels
                      },
                    }}
                    series={[{ data: emailSeries }]} // dynamically assigned series
                    height={250}
                    type="bar"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-6 col-lg-4 d-flex align-items-stretch">
              <div class="card w-100">
                <div class="card-body">
                  <h4 class="card-title fw-semibold">Account used</h4>
                  <p class="card-subtitle mb-4">Total Email Sent per account</p>
                  <div class="d-flex align-items-center">
                    {Object.keys(analyticdata?.sentemail?.account ?? {}).map(
                      (value, index) => {
                        return (
                          <div class="me-4">
                            <span class="round-8 text-bg-primary rounded-circle me-2 d-inline-block"></span>
                            <span class="fs-2">{value}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <div id="revenue-chart" class="revenue-chart mx-n3">
                    <Chart
                      options={{
                        chart: { id: "bar-chart" },
                        xaxis: {
                          categories: Object.keys(
                            analyticdata?.sentemail?.account ?? {}
                          ),
                        },
                      }}
                      series={[
                        {
                          name: "Sales",
                          data: Object.values(
                            analyticdata?.sentemail?.account ?? {}
                          ).map((value, index) => value.success),
                        },
                      ]}
                      type="bar"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 d-flex align-items-stretch">
              <div class="card w-100">
                <div class="card-body">
                  <h4 class="card-title fw-semibold">Cron Overview</h4>
                  <p class="card-subtitle mb-2">Current scheduled Emails</p>
                  <div id="revenue-chart" class="revenue-chart mx-n3">
                    <Chart
                      options={{
                        chart: { id: "bar-chart" },
                        xaxis: { categories: ["Total Emails", "Sent Emails"] },
                      }}
                      series={[
                        {
                          name: "Sales",
                          data: [
                            Object.values(
                              analyticdata?.scheduleemail?.account ?? {}
                            )
                              .map((value, index) => value.total)
                              .reduce((acc, num) => acc + num, 0),
                            Object.values(
                              analyticdata?.scheduleemail?.account ?? {}
                            )
                              .map((value, index) => value.success)
                              .reduce((acc, num) => acc + num, 0),
                          ],
                        },
                      ]}
                      type="bar"
                    />
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary-subtle text-primary rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                        <i class="ti ti-grid-dots fs-3"></i>
                      </div>
                      <div>
                        <h6 class="fw-semibold text-dark fs-3 mb-0">
                          {Object.values(
                            analyticdata?.scheduleemail?.account ?? {}
                          )
                            .map((value, index) => value.pending_crons)
                            .reduce((acc, num) => acc + num, 0)}
                        </h6>
                        <p class="fs-2 mb-0 fw-normal">Pending</p>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <div class="bg-secondary-subtle text-secondary rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                        <i class="ti ti-grid-dots fs-3"></i>
                      </div>
                      <div>
                        <h6 class="fw-semibold text-dark fs-3 mb-0">
                          {Object.values(
                            analyticdata?.scheduleemail?.account ?? {}
                          )
                            .map((value, index) => value.inprocess_crons)
                            .reduce((acc, num) => acc + num, 0)}
                        </h6>
                        <p class="fs-2 mb-0 fw-normal">Inprocess</p>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <div class="bg-secondary-subtle text-secondary rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                        <i class="ti ti-grid-dots fs-3"></i>
                      </div>
                      <div>
                        <h6 class="fw-semibold text-dark fs-3 mb-0">
                          {Object.values(
                            analyticdata?.scheduleemail?.account ?? {}
                          )
                            .map((value, index) => value.completed_crons)
                            .reduce((acc, num) => acc + num, 0)}
                        </h6>
                        <p class="fs-2 mb-0 fw-normal">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card w-100">
                <div class="card-body p-4">
                  <p class="mb-2 fs-3">Call Status</p>
                  <Chart
                    id="callstatus"
                    options={{
                      chart: {
                        type: "bar",
                        height: 250,
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 4,
                          borderRadiusApplication: "end",
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                      xaxis: {
                        categories: callLabels, // dynamically assigned labels
                      },
                    }}
                    series={[{ data: callSeries }]} // dynamically assigned series
                    height={250}
                    type="bar"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-12 col-lg-12 d-flex align-items-stretch">
              <div class="card w-100">
                <div class="card-body">
                  <div class="d-sm-flex d-block align-items-center justify-content-between mb-9">
                    <div class="mb-3 mb-sm-0">
                      <h4 class="card-title fw-semibold">Country Stats</h4>
                      <p class="card-subtitle mb-0">Overview of Calls/Emails</p>
                    </div>
                    <select
                      onChange={(e) => {
                        filtercountrystats(e, "email");
                      }}
                      className="form-select w-auto"
                    >
                      {defaultvalue.names.map((value, index) => {
                        return (
                          <option key={index} value={value.key}>
                            {value.value}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      onChange={(e) => {
                        filtercountrystats(e, "call");
                      }}
                      className="form-select w-auto"
                    >
                      {defaultvalue.callnames.map((value, index) => {
                        return (
                          <option key={index} value={value.key}>
                            {value.value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div class="position-relative">
                    {option ? (
                      <ReactECharts
                        option={option}
                        notMerge={true}
                        style={{ height: "600px", width: "100%" }}
                      />
                    ) : (
                      <p>Loading map...</p>
                    )}
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
                          <h6 class="fw-semibold text-dark fs-4 mb-0">
                            $36,358
                          </h6>
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="bg-light-subtle text-muted rounded-2 me-8 p-8 d-flex align-items-center justify-content-center">
                          <i class="ti ti-grid-dots fs-6"></i>
                        </div>
                        <div>
                          <p class="fs-3 mb-0 fw-normal">Expenses</p>
                          <h6 class="fw-semibold text-dark fs-4 mb-0">
                            $5,296
                          </h6>
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
                          <img
                            src="../assets/images/svgs/icon-paypal2.svg"
                            alt="modernize-img"
                            class="img-fluid"
                            width="24"
                            height="24"
                          />
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
                          <img
                            src="../assets/images/svgs/icon-wallet.svg"
                            alt="modernize-img"
                            class="img-fluid"
                            width="24"
                            height="24"
                          />
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
                          <img
                            src="../assets/images/svgs/icon-credit-card.svg"
                            alt="modernize-img"
                            class="img-fluid"
                            width="24"
                            height="24"
                          />
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
                          <img
                            src="../assets/images/svgs/icon-pie2.svg"
                            alt="modernize-img"
                            class="img-fluid"
                            width="24"
                            height="24"
                          />
                        </div>
                        <div>
                          <h6 class="mb-1 fs-4 fw-semibold">Refund</h6>
                          <p class="fs-3 mb-0">Bill payment</p>
                        </div>
                      </div>
                      <h6 class="mb-0 fw-semibold text-muted">-$32</h6>
                    </div>
                  </div>
                  <button class="btn btn-outline-primary w-100">
                    View all transactions
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 d-flex align-items-stretch d-none">
              <div class="card w-100">
                <div class="card-body">
                  <div class="mb-4">
                    <h4 class="card-title fw-semibold">Recent Transactions</h4>
                    <p class="card-subtitle">
                      How to Secure Recent Transactions
                    </p>
                  </div>
                  <ul class="timeline-widget mb-0 position-relative mb-n5">
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">
                        09:30
                      </div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-primary flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1">
                        Payment received from John Doe of $385.90
                      </div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">
                        10:00 am
                      </div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-info flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                        New sale recorded{" "}
                        <a
                          href="javascript:void(0)"
                          class="text-primary d-block fw-normal "
                        >
                          #ML-3467
                        </a>
                      </div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">
                        12:00 am
                      </div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-success flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1">
                        Payment was made of $64.95 to Michael
                      </div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">
                        09:30 am
                      </div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-warning flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                        New sale recorded{" "}
                        <a
                          href="javascript:void(0)"
                          class="text-primary d-block fw-normal "
                        >
                          #ML-3467
                        </a>
                      </div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">
                        09:30 am
                      </div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-danger flex-shrink-0 my-8"></span>
                        <span class="timeline-badge-border d-block flex-shrink-0"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                        New arrival recorded{" "}
                        <a
                          href="javascript:void(0)"
                          class="text-primary d-block fw-normal "
                        >
                          #ML-3467
                        </a>
                      </div>
                    </li>
                    <li class="timeline-item d-flex position-relative overflow-hidden">
                      <div class="timeline-time text-dark flex-shrink-0 text-end">
                        12:00 am
                      </div>
                      <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span class="timeline-badge border-2 border border-success flex-shrink-0 my-8"></span>
                      </div>
                      <div class="timeline-desc fs-3 text-dark mt-n1">
                        Payment Done
                      </div>
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
                      <h4 class="card-title fw-semibold">
                        Product Performances
                      </h4>
                      <p class="card-subtitle">
                        What Impacts Product Performance?
                      </p>
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
                          <th scope="col" class="ps-0">
                            Assigned
                          </th>
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
                                <img
                                  src="../assets/images/products/product-1.jpg"
                                  class="rounded-2"
                                  width="48"
                                  height="48"
                                  alt="modernize-img"
                                />
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
                            <span class="badge fw-semibold py-1 w-85 bg-success-subtle text-success">
                              Low
                            </span>
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
                                <img
                                  src="../assets/images/products/product-2.jpg"
                                  class="rounded-2"
                                  width="48"
                                  height="48"
                                  alt="modernize-img"
                                />
                              </div>
                              <div>
                                <h6 class="fw-semibold mb-1">
                                  Web App Project
                                </h6>
                                <p class="fs-2 mb-0 text-muted">
                                  Mathew Flintoff
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="mb-0 fs-3 text-dark">56.8%</p>
                          </td>
                          <td>
                            <span class="badge fw-semibold py-1 w-85 bg-warning-subtle text-warning">
                              Medium
                            </span>
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
                                <img
                                  src="../assets/images/products/product-3.jpg"
                                  class="rounded-2"
                                  width="48"
                                  height="48"
                                  alt="modernize-img"
                                />
                              </div>
                              <div>
                                <h6 class="fw-semibold mb-1">
                                  Modernize Dashboard
                                </h6>
                                <p class="fs-2 mb-0 text-muted">Anil Kumar</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="mb-0 fs-3 text-dark">25%</p>
                          </td>
                          <td>
                            <span class="badge fw-semibold py-1 w-85 bg-info-subtle text-info">
                              Very high
                            </span>
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
                                <img
                                  src="../assets/images/products/product-4.jpg"
                                  class="rounded-2"
                                  width="48"
                                  height="48"
                                  alt="modernize-img"
                                />
                              </div>
                              <div>
                                <h6 class="fw-semibold mb-1">Dashboard Co</h6>
                                <p class="fs-2 mb-0 text-muted">
                                  George Cruize
                                </p>
                              </div>
                            </div>
                          </td>
                          <td class="border-bottom-0">
                            <p class="mb-0 fs-3 text-dark">96.3%</p>
                          </td>
                          <td class="border-bottom-0">
                            <span class="badge fw-semibold py-1 w-85 bg-danger-subtle text-danger">
                              High
                            </span>
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
};

export default Datanalyticsidebar;
