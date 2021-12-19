import React, {useState, useEffect} from 'react';
import { Line, G2 } from '@ant-design/charts';
import {Card} from 'antd';
import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';
import axios from 'axios';
import { each, findIndex } from '@antv/util';

export default () => {
  const { InteractionAction, registerInteraction, registerAction } = G2;
  const user = fetchCurrentUser();
  const [logins, setLogins] = useState([]);
  const [load, setLoad] = useState(false);
  const [data1,setData1] = useState([]);
  const [data2,setData2] = useState([]);
  const [data3,setData3] = useState([]);
  const [data4,setData4] = useState([]);
  const [data5,setData5] = useState([]);
  const [data6,setData6] = useState([]);
  const [data7,setData7] = useState([]);
  const [data8,setData8] = useState([]);
  const [data9,setData9] = useState([]);
  const [data10,setData10] = useState([]);
  const [data11,setData11] = useState([]);
  const [data12,setData12] = useState([]);
  const year = new Date().getFullYear();

  const configU = {
      headers: {
          Authorization: `Bearer ${user.token}`
      }
  }

  useEffect (() => {
    const f = async () => {
        const urlLogin = `${DEFAULT_HOST}/admin/search-health-record`;
        try {
            const resultLogins = await axios.get(urlLogin, configU);
            setLogins(resultLogins.data.data);
            
            if(logins===undefined) {
              setLoad(true);
            }
            else {
              setLoad(true);
              const a = [];
              logins.map((element) => {
                  const timeData = new Date(element.health_record_created_at);
                  const monthData = timeData.getMonth()+1;
                  const yearData = timeData.getFullYear();
                  const yearNow = new Date().getFullYear();
                  
                  if(yearData === yearNow){
                    switch (monthData){
                      case 1:
                        a.push(element)
                        setData1(a);
                        break;
                      case 2:
                        a.push(element)
                        setData2(a);
                        break;
                      case 3:
                        a.push(element)
                        setData3(a);
                        break;
                      case 4:
                        a.push(element)
                        setData4(a);
                        break;
                      case 5:
                        a.push(element)
                        setData5(a);
                        break;
                      case 6:
                        a.push(element)
                        setData6(a);
                        break;
                      case 7:
                        a.push(element)
                        setData7(a);
                        break;
                      case 8:
                        a.push(element)
                        setData8(a);
                        break;
                      case 9:
                        a.push(element)
                        setData9(a);
                        break;
                      case 10:
                        a.push(element)
                        setData10(a);
                        break;
                      case 11:
                        a.push(element)
                        setData11(a);
                        break;
                      default: 
                        a.push(element)
                        setData12(a);
                        break;
                    }
                  }
                  return ''
                })
            }
        } catch (error) {
            // alert(error);
        }
        return "";
    }
    f();
  }, [load])
  
  const data = [
    {
      month: 'Tháng 1',
      value: data1.length,
    },
    {
      month: 'Tháng 2',
      value: data2.length,
    },
    {
      month: 'Tháng 3',
      value: data3.length,
    },
    {
      month: 'Tháng 4',
      value: data4.length,
    },
    {
      month: 'Tháng 5',
      value: data5.length,
    },
    {
      month: 'Tháng 6',
      value: data6.length,
    },
    {
      month: 'Tháng 7',
      value: data7.length,
    },
    {
      month: 'Tháng 8',
      value: data8.length,
    },
    {
      month: 'Tháng 9',
      value: data9.length,
    },
    {
      month: 'Tháng 10',
      value: data10.length,
    },
    {
      month: 'Tháng 11',
      value: data11.length,
    },
    {
      month: 'Tháng 12',
      value: data12.length,
    },
    
  ];
  
  G2.registerShape('point', 'custom-point', {
    draw(cfg, container) {
      const point = {
        x: cfg.x,
        y: cfg.y,
      };
      const group = container.addGroup();
      group.addShape('circle', {
        name: 'outer-point',
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || '#00bfff',
          opacity: 0.5,
          r: 6,
        },
      });
      group.addShape('circle', {
        name: 'inner-point',
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || '#00bfff',
          opacity: 1,
          r: 2,
        },
      });
      return group;
    },
  });

  class CustomMarkerAction extends InteractionAction {
    active() {
      const view = this.getView();
      const evt = this.context.event;

      if (evt.data) {
        // items: 数组对象，当前 tooltip 显示的每条内容
        const { items } = evt.data;
        const pointGeometries = view.geometries.filter((geom) => geom.type === 'point');
        each(pointGeometries, (pointGeometry) => {
          each(pointGeometry.elements, (pointElement) => {
            const active = findIndex(items, (item) => item.data === pointElement.data) !== -1;
            const [point0, point1] = pointElement.shape.getChildren();

            if (active) {
              // outer-circle
              point0.animate(
                {
                  r: 10,
                  opacity: 0.2,
                },
                {
                  duration: 1800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              ); // inner-circle

              point1.animate(
                {
                  r: 6,
                  opacity: 0.4,
                },
                {
                  duration: 800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              );
            } else {
              this.resetElementState(pointElement);
            }
          });
        });
      }
    }

    reset() {
      const view = this.getView();
      const points = view.geometries.filter((geom) => geom.type === 'point');
      each(points, (point) => {
        each(point.elements, (pointElement) => {
          this.resetElementState(pointElement);
        });
      });
    }

    resetElementState(element) {
      const [point0, point1] = element.shape.getChildren();
      point0.stopAnimate();
      point1.stopAnimate();
      const { r, opacity } = point0.get('attrs');
      point0.attr({
        r,
        opacity,
      });
      const { r: r1, opacity: opacity1 } = point1.get('attrs');
      point1.attr({
        r: r1,
        opacity: opacity1,
      });
    }

    getView() {
      return this.context.view;
    }
  }

  registerAction('custom-marker-action', CustomMarkerAction);
  registerInteraction('custom-marker-interaction', {
    start: [
      {
        trigger: 'tooltip:show',
        action: 'custom-marker-action:active',
      },
    ],
    end: [
      {
        trigger: 'tooltip:hide',
        action: 'custom-marker-action:reset',
      },
    ],
  });
  const config = {
    data,
    xField: 'month',
    yField: 'value',
    label: {},
    point: {
      size: 5,
      shape: 'custom-point',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'custom-marker-interaction',
      },
    ],
  };
  return <Card title={`Thống kê số sổ  khám năm ${year}`}><Line {...config} /></Card>;
};
