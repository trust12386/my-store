import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getList, setItem } from '../../store/slice/listSlice';

import bg from '../../assets/1.jpg';
import './index.css';
import * as echarts from 'echarts';
import '../../assets/china';
import { geoCoordMap } from '../../assets/geoMap';

function Demo(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getList());
    initCharts();
    initPie();
    initLine();
  }, []);//eslint-disable-line

  const list = useSelector((state) => {
    return state.list.list;
  });
  const chinaAdd = useSelector((state) => {
    return state.list.chinaAdd;
  });
  const chinaTotal = useSelector((state) => {
    return state.list.chinaTotal;
  });
  const cityDetail = useSelector((state) => {
    return state.list.cityDetail;
  });
  const item = useSelector((state) => {
    return state.list.item;
  });

  const listItems = item.map((item, index) => {
    return (
      <tr key={item.name + index}>
        <td>{item.name}</td>
        <td>{item.today.confirm}</td>
        <td>{item.total.confirm}</td>
        <td>{item.total.heal}</td>
        <td>{item.total.dead}</td>
      </tr>
    );
  });

  const initCharts = () => {
    const city = list.diseaseh5Shelf.areaTree[0].children;
    dispatch(setItem(city[2].children));
    const data = city.map((v) => {
      return {
        name: v.name,
        value: geoCoordMap[v.name].concat(v.total.nowConfirm),
        children: v.children,
      };
    });
    const charts = echarts.init(document.querySelector('#china'));
    charts.setOption({
      geo: {
        map: 'china',
        aspectScale: 0.8,
        layoutCenter: ['50%', '50%'],
        layoutSize: '100%',
        itemStyle: {
          //normal: {
          areaColor: {
            type: 'linear-gradient',
            x: 0,
            y: 1200,
            x2: 1000,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: '#152E6E', // 0% ????????????
              },
              {
                offset: 1,
                color: '#0673AD', // 50% ????????????
              },
            ],
            global: true, // ????????? false
            //},
            shadowColor: '#0f5d9d',
            shadowOffsetX: 0,
            shadowOffsetY: 15,
            opacity: 0.5,
          },
        },
        emphasis: {
          areaColor: '#0f5d9d',
        },
        regions: [
          {
            name: '????????????',
            itemStyle: {
              areaColor: 'rgba(0, 10, 52, 1)',
              borderColor: 'rgba(0, 10, 52, 1)',
              //normal: {
              opacity: 0,
              label: {
                show: false,
                color: '#009cc9',
              },
              //},
            },
            label: {
              show: false,
              color: '#FFFFFF',
              fontSize: 12,
            },
          },
        ],
      },
      series: [
        {
          type: 'map',
          map: 'china',
          aspectScale: 0.8,
          layoutCenter: ['50%', '50%'], //????????????
          layoutSize: '100%',
          zoom: 1, //???????????????????????????
          // roam: true, //???????????????????????????
          scaleLimit: {
            //???????????????????????????
            min: 1,
            max: 2,
          },
          label: {
            show: true,
            color: '#FFFFFF',
            fontSize: 12,
          },
          itemStyle: {
            // normal: {
            areaColor: '#0c3653',
            borderColor: '#1cccff',
            borderWidth: 1.8,
            // },
          },
          emphasis: {
            areaColor: '#56b1da',
            label: {
              show: true,
              color: '#fff',
            },
          },
          data: data,
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'pin',
          symbolSize: [50, 50],
          // symbolOffset:[0, '-40%'] ,
          label: {
            show: true,
            color: '#FFF',
            formatter(value) {
              return value.data.value[2];
            },
          },
          itemStyle: {
            //normal: {
            color: '#207ad9', //????????????
            //},
          },
          data: data,
        },
      ],
    });

    charts.on('click', (e) => {
      dispatch(setItem(e.data.children));
    });
  };

  const initPie = () => {
    console.log(cityDetail);
    const charts = echarts.init(document.querySelector('.box-left-pie'));
    charts.setOption({
      backgroundColor: '#223651',
      tooltip: {
        trigger: 'item',
      },
      legend: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: '#fff', borderWidth: 2 },
          label: {
            show: true,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
            },
          },
          data: cityDetail.map((v) => {
            return {
              name: v.city,
              value: v.nowConfirm,
            };
          }),
        },
      ],
    });
  };

  const initLine = () => {
    const charts = echarts.init(document.querySelector('.box-left-line'));
    charts.setOption({
      backgroundColor: '#223651',
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: cityDetail.map((v) => v.city),
        axisLine: {
          lineStyle: {
            color: '#fff',
          },
        },
        axisTick: {
          interval: 0,
          alignWithLabel: true,
        },
        axisLabel: {
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff',
          },
        },
      },
      label: {
        show: true,
      },
      series: [
        {
          data: cityDetail.map((v) => v.nowConfirm),
          type: 'line',
          smooth: true,
        },
      ],
    });
  };

  return (
    <div style={{ background: `url(${bg})` }} className="box">
      <div className="box-left">
        <div className="box-left-card">
          <section>
            <div>?????????+{chinaAdd.localConfirmH5}</div>
            <div>{chinaTotal.localConfirm}</div>
            <div>??????????????????</div>
          </section>
          <section>
            <div>?????????+{chinaAdd.nowConfirm}</div>
            <div>{chinaTotal.nowConfirm}</div>
            <div>????????????</div>
          </section>
          <section>
            <div>?????????+{chinaAdd.confirm}</div>
            <div>{chinaTotal.confirm}</div>
            <div>????????????</div>
          </section>
          <section>
            <div>?????????+{chinaAdd.noInfect}</div>
            <div>{chinaTotal.noInfect}</div>
            <div>??????????????????</div>
          </section>
          <section>
            <div>?????????+{chinaAdd.importedCase}</div>
            <div>{chinaTotal.importedCase}</div>
            <div>????????????</div>
          </section>
          <section>
            <div>?????????+{chinaAdd.dead}</div>
            <div>{chinaTotal.dead}</div>
            <div>????????????</div>
          </section>
        </div>
        <div className="box-left-pie"></div>
        <div className="box-left-line"></div>
      </div>
      <div id="china" className="box-middle"></div>
      <div className="box-right">
        <table className="table" border="1" cellSpacing="0">
          <thead>
            <tr>
              <th>??????</th>
              <th>????????????</th>
              <th>????????????</th>
              <th>??????</th>
              <th>??????</th>
            </tr>
          </thead>
          <tbody>{listItems}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Demo;
