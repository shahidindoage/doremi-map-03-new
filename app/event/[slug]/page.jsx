'use client'
import StripePaymentPopup from '@/components/StripePaymentPopup'
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react'
import React from "react";
export default function EventPage({ params }) {
  const { slug } = React.use(params);
  const router = useRouter();
  const [tablesMap, setTablesMap] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, seat: null })
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showPayment, setShowPayment] = useState(false);
  const layoutRef = useRef(null)
  const [pan, setPan] = useState({ x: 0, y: 0 });
const panRef = useRef({ x: 0, y: 0, isDragging: false, startX: 0, startY: 0 });
const cartRef = useRef(null);
  const maxZoom = isMobile ? 4 : 2; // allow more zoom on mobile
const minZoom = 0.5;

const [cartItems, setCartItems] = useState([]);
const [showCart, setShowCart] = useState(false);
// Add state for name/email popup
const [showUserForm, setShowUserForm] = useState(false);
const [customerName, setCustomerName] = useState('');
const [customerEmail, setCustomerEmail] = useState('');
const [customerPhone, setCustomerPhone] = useState('');

const handlePaymentSuccess = () => {
    router.refresh(); // WORKS
  };
  // ✅ Detect device width dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ✅ Fetch seat data
  useEffect(() => {
    fetch(`/api/events/${slug}/seats`)
      .then(res => res.json())
      .then(data => {
        if (data.tables) {
          const map = {}
          data.tables.forEach(t => {
            map[t.number] = {
              id: t.id,
              seats: t.seats.length,
              price: t.price,
              color: t.color,
              top: t.top,
              left: t.left,
              seatDetails: t.seats.reduce((acc, s) => {
                acc[s.seatNo] = s
                return acc
              }, {})
            }
          })
          setTablesMap(map)
        }
      })
  }, [slug])

  // ✅ Table position maps
  const getPositionForTable = (num) => {
    const desktopTables = {
      210: { top: '36.2%', left: '31.9%' },
      403: { top: '63.5%', left: '47%' },
      211: { top: '29.6%', left: '31.9%' },
      404: { top: '63.7%', left: '55%' },
      701: { top: '51.6%', left: '66.8%' },
      703: { top: '36.2%', left: '66.2%' },
      705: { top: '49.6%', left: '71.3%' },
      706: { top: '43.9%', left: '70.9%' },
      704: { top: '30.9%', left: '66.2%' },
      803: { top: '42.9%', left: '79.6%' },
      804: { top: '36.9%', left: '79.6%' },
      805: { top: '44.5%', left: '84.7%' },
      806: { top: '38.8%', left: '84.4%' },
      306: {  top: '64.5%', left: '23.7%'},
      305: {  top: '66.8%', left: '28.4%'},
      807: {  top: '33.8%', left: '83.7%'},
      501: { top: '71.5%', left: '57.7%'},
      502: { top: '71.5%', left: '51.4%'},
      503: { top: '71.5%', left: '43.7%'},
      405: {  top: '67.8%', left: '64.4%' },
      601: { top: '69.5%', left: '72.7%' },
      602: {  top: '63.8%', left: '72.7%' },
      301: { top: '57.5%', left: '34.7%'},
      302: { top: '53.8%', left: '29.4%'},
      303: { top: '61.8%', left: '31.4%'},
      304: { top: '57.8%', left: '26.4%'},
      801: {  top: '44.8%', left: '75.4%'},
      802: {  top: '36.8%', left: '75.4%'},
      1: {  top: '48.9%', left: '50.9%' },
      101: {  top: '46.9%', left: '55.9%' },
      102: {  top: '33.9%', left: '54.9%' },
      105: {  top: '42.9%', left: '59.9%' },
      106: {  top: '37.9%', left: '58.9%' },
      201: {  top: '47.9%', left: '45.9%' },
      202: {  top: '32.9%', left: '44.9%' },
      205: {  top: '42.9%', left: '40.9%' },
      206: {  top: '37.9%', left: '42.9%' },
      104: {  top: '48.9%', left: '60.9%'},
      107: {  top: '31.9%', left: '59.9%'},
      702: {  top: '45.9%', left: '66.2%'},
      204: {  top: '47.9%', left: '38.9%'},
      207: {  top: '31.9%', left: '38.9%'},
      209: {  top: '37.9%', left: '37.9%'},
      401: {  top: '58.9%', left: '43.9%'},
      402: {top: '58.9%', left: '57.9%'},
      422: {  top: '58.9%', left: '51.9%'},
    }

    // const mobileTables = {
    //     210: { top: '36.2%', left: '31.9%' },
    //   403: { top: '63.5%', left: '47%' },
    //   211: { top: '29.6%', left: '31.9%' },
    //   404: { top: '63.7%', left: '55%' },
    //   701: { top: '51.6%', left: '66.8%' },
    //   703: { top: '36.2%', left: '66.2%' },
    //   705: { top: '49.6%', left: '71.3%' },
    //   706: { top: '43.9%', left: '70.9%' },
    //   704: { top: '30.9%', left: '66.2%' },
    //   803: { top: '42.9%', left: '79.3%' },
    //   804: { top: '36.9%', left: '79.3%' },
    //   805: { top: '44.5%', left: '84.7%' },
    //   806: { top: '38.8%', left: '84.4%' },
    // }

    return desktopTables[num]
  }

  // ✅ Render all tables and seats dynamically
  useEffect(() => {
    const layout = layoutRef.current
    if (!layout || !Object.keys(tablesMap).length) return
    layout.innerHTML = ''

    const radius = isMobile ? 7.2 : 15

    Object.entries(tablesMap).forEach(([tableNum, table]) => {
      const pos = getPositionForTable(Number(tableNum)) || {}
      const container = document.createElement('div')
      container.classList.add('table-container')
      Object.assign(container.style, {
        position: 'absolute',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'transparent',
        transform: 'translate(-50%, -50%)',
        top: pos.top || table.top,
        left: pos.left || table.left
      })

      const center = document.createElement('div')
      center.classList.add('center')
      Object.assign(center.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      })

      const tableDiv = document.createElement('div')
tableDiv.classList.add('table')

// 🟨 Make 801 & 802 square, all others circular
const isSquareTable = ['801', '802'].includes(String(tableNum))

Object.assign(tableDiv.style, {
  width: isSquareTable ? (isMobile ? '6px' : '12px') : (isMobile ? '10.5px' : '24px'),
  height: isSquareTable ? (isMobile ? '19px' : '42px') : (isMobile ? '10.5px' : '24px'),
  borderRadius: isSquareTable ? '0px' : '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: table.color,
  boxShadow: isSquareTable
    ? '0 0 8px rgba(255,255,255,0.3)'  // slightly smaller glow on mobile
    : '0 0 4px rgba(255,255,255,0.2)'
})



      const seatCountDiv = document.createElement('div')
      seatCountDiv.classList.add('seat-count')
      Object.assign(seatCountDiv.style, {
        background: 'black',
        width: '11.5px',
        height: '11.5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%'
      })
      seatCountDiv.innerHTML = `<span style="color:${table.color}; font-size:7px;">${table.seats}</span>`
      tableDiv.appendChild(seatCountDiv)
      center.appendChild(tableDiv)

      // ✅ Render each seat
      for (let i = 1; i <= table.seats; i++) {
        const seat = document.createElement('div')
        seat.classList.add('seat-item')
        Object.assign(seat.style, {
          position: 'absolute',
          width: '6px',
          height: '5px',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background 0.2s ease, color 0.2s ease'
        })
        seat.textContent = i

        // 🟩 Manual seat arrangement for 801 and 802
const rightOffset = isMobile ? '104%' : '98%';
const topOffsetStep = isMobile ? 3.8 : 9;
const topOffsetBottom = isMobile ? '101%' : '103%';
const topOffsetTop = isMobile ? '-13%' : '-13%';

if (tableNum === '801') {
  // 5 on right, 1 on bottom
  if (i <= 5) {
    seat.style.left = rightOffset;
    seat.style.top = `${1 + (i - 1) * topOffsetStep}px`;
    seat.style.transform = 'rotate(90deg)';
  } else {
    seat.style.left = '50%';
    seat.style.top = topOffsetBottom;
    seat.style.transform = 'translateX(-50%) rotate(180deg)';
  }
} 
else if (tableNum === '802') {
  // Seat 1 on top, seats 2–6 on right
  if (i === 1) {
    // top seat
    seat.style.left = '50%';
    seat.style.top = topOffsetTop;
    seat.style.transform = 'translateX(-50%) rotate(0deg)';
  } else {
    // right-side seats (2–6)
    seat.style.left = rightOffset;
    seat.style.top = `${1 + (i - 2) * topOffsetStep}px`;
    seat.style.transform = 'rotate(90deg)';
  }
}

 
else {
  // ✅ Default circular arrangement for all others
  const angle = (i - 1) * (360 / table.seats)
  const x = radius * Math.cos((angle - 90) * Math.PI / 180)
  const y = radius * Math.sin((angle - 90) * Math.PI / 180)
  seat.style.left = `calc(50% + ${x}px)`
  seat.style.top = `calc(50% + ${y}px)`
  seat.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`
}

        const meta = table.seatDetails[i]
        const isBooked = meta?.status === 'BOOKED'

        seat.style.background = isBooked ? '#696969' : table.color
        seat.style.color = isBooked ? '#fff' : '#111'

        if (!isBooked && selectedSeat?.tableNumber === tableNum && selectedSeat?.seatNo === i) {
          seat.style.background = '#fff'
          seat.style.color = '#000'
        }

        // ✅ Tooltip handling (desktop + mobile)
        seat.addEventListener('click', (e) => {
          e.stopPropagation()
          setSelectedSeat(isBooked ? null : { tableNumber: tableNum, seatNo: i, price: table.price, color: table.color })
          setTooltip({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            seat: {
              tableNumber: tableNum,
              seatNo: i,
              price: table.price,
              color: isBooked ? '#696969' : table.color,
              booked: isBooked
            }
          })
        })

        center.appendChild(seat)
      }

      container.appendChild(center)
      layout.appendChild(container)
    })
  }, [tablesMap, selectedSeat, isMobile])

  // ✅ Tooltip fade in/out
  useEffect(() => {
    if (tooltip.visible) setTooltipVisible(true)
    else {
      const t = setTimeout(() => setTooltipVisible(false), 200)
      return () => clearTimeout(t)
    }
  }, [tooltip.visible])

  // ✅ Close tooltip when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.seat-item') && !e.target.closest('.tooltip-box')) {
        setTooltip({ visible: false, x: 0, y: 0, seat: null })
        setSelectedSeat(null)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
  const preventZoom = (e) => {
    if (e.ctrlKey) e.preventDefault();
  };
  window.addEventListener("wheel", preventZoom, { passive: false });

  return () => window.removeEventListener("wheel", preventZoom);
}, []);

useEffect(() => {
  const layout = layoutRef.current?.parentElement; // the div with background
  if (!layout) return;

  const onMouseDown = (e) => {
    e.preventDefault();
    panRef.current.isDragging = true;
    panRef.current.startX = e.clientX - panRef.current.x;
    panRef.current.startY = e.clientY - panRef.current.y;

     setTooltip({ visible: false, x: 0, y: 0, seat: null }) // hide tooltip
     setSelectedSeat(null)
  }

  const onMouseMove = (e) => {
    if (!panRef.current.isDragging) return;
    let newX = e.clientX - panRef.current.startX;
    let newY = e.clientY - panRef.current.startY;
    setPan({ x: newX, y: newY });
  }

  const onMouseUp = () => {
    panRef.current.isDragging = false;
    panRef.current.x = pan.x;
    panRef.current.y = pan.y;
  }

  layout.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  // mobile touch support
  const onTouchStart = (e) => {
    panRef.current.isDragging = true;
    panRef.current.startX = e.touches[0].clientX - panRef.current.x;
    panRef.current.startY = e.touches[0].clientY - panRef.current.y;

     setTooltip({ visible: false, x: 0, y: 0, seat: null }) // hide tooltip
     setSelectedSeat(null)
  }
  const onTouchMove = (e) => {
    if (!panRef.current.isDragging) return;
    let newX = e.touches[0].clientX - panRef.current.startX;
    let newY = e.touches[0].clientY - panRef.current.startY;
    setPan({ x: newX, y: newY });
    
  }
  const onTouchEnd = () => {
    panRef.current.isDragging = false;
    panRef.current.x = pan.x;
    panRef.current.y = pan.y;
  }

  layout.addEventListener('touchstart', onTouchStart);
  layout.addEventListener('touchmove', onTouchMove);
  layout.addEventListener('touchend', onTouchEnd);

  return () => {
    layout.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    layout.removeEventListener('touchstart', onTouchStart);
    layout.removeEventListener('touchmove', onTouchMove);
    layout.removeEventListener('touchend', onTouchEnd);
  }
}, [pan]);

const addToCart = (seat) => {
  // Check if already in cart
  const exists = cartItems.find(
    (item) => item.tableNumber === seat.tableNumber && item.seatNo === seat.seatNo
  );
  if (exists) return alert("Seat already in cart!");

  setCartItems([...cartItems, seat]);
  setShowCart(true);
};

const removeFromCart = (seat) => {
  setCartItems(cartItems.filter(
    (item) => !(item.tableNumber === seat.tableNumber && item.seatNo === seat.seatNo)
  ));
};


  return (
    <div className='main'>
      
        {/* <span className='table-no' style={{top:'12%',left:'36%', transform: 'translate(-50%, -50%)'}}>211</span>
        <span className='table-no' style={{top:'19%',left:'36%',}}>210</span>
       */}
      
      {/* ✅ Map background */}
      <div className='map'>
        <div
  className="layout"
  style={{
    width: '90vw',
    maxWidth: 1000,
    aspectRatio: '1/1',
    position: 'relative',
    backgroundImage: `url('https://moonlit-dolphin-3aa2c4.netlify.app/bg-3.PNG')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    marginTop:'-9%',
    backgroundPosition: 'center',
    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
    transformOrigin: 'center center',
    transition: panRef.current.isDragging ? 'none' : 'transform 0.3s ease'
  }}
>
  <span className='stage'>Stage</span>
  {/* <span className='stage1'>Note:&nbsp;&nbsp;Please use the zoom buttons for better visualization.</span> */}
  <div ref={layoutRef} style={{ position: 'absolute', inset: 0 }} />

  {/* Table numbers */}
  {Object.entries(tablesMap).map(([tableNum, table]) => {
  const pos = getPositionForTable(Number(tableNum)) || {}

  // Default transform for all tables
  // let translateY = '130%'
  let translateY = isMobile ? '205%' : '130%'
let translateX = '-50%'
  // Special adjustment for table 802
  if (tableNum === '801' || tableNum === '802'  ) 
    {
      translateX = '-20%'
      
      translateY = isMobile ? '275%' : '180%'

    } 

    if(tableNum === '701'){
translateX = '-20%'
    }

    if(tableNum === '104'){
translateX = '-60%'
    }

  return (
    <span
      key={tableNum}
      className="table-no"
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        color: '#fff',
        fontWeight: 600,
        fontSize: '10px',
        transform: `translate(${translateX}, ${translateY})`
      }}
    >
      {tableNum}
    </span>
  )
})}

</div>

      </div>

      {/* ✅ Tooltip */}
      {tooltipVisible && tooltip.seat && (
        <div
          className="tooltip-box"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -120%)',
            background: tooltip.seat.color,
            padding: '6px 12px',
            zIndex: 1000,
            color: '#fff',
            minWidth: 110,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            opacity: tooltip.visible ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          <div style={{ fontSize: 10, color: '#111', fontWeight: 600 }}>
            Seat: Table {tooltip.seat.tableNumber}-{tooltip.seat.seatNo}
          </div>
          <div style={{ fontSize: 10, color: '#111', fontWeight: 600 }}>
            {tooltip.seat.booked
              ? `Price: ${Number(tooltip.seat.price).toFixed(3)} AED`
              : `Price: ${Number(tooltip.seat.price).toFixed(3)} AED`}
          </div>
         {/* Tooltip Button (with WhatsApp link) */}
{tooltip.seat.booked ? (
  <button
    disabled
    style={{
      background: "#444",
      border: "none",
      padding: "3px 15px",
      borderRadius: 4,
      color: "#999",
      cursor: "not-allowed",
      fontWeight: 600,
      fontSize: "8px",
    }}
  >
    Booked
  </button>
) : (
  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
    {/* ✅ Stripe Payment */}
    <button
  onClick={() => addToCart({
    tableNumber: tooltip.seat.tableNumber,
    seatNo: tooltip.seat.seatNo,
    price: tooltip.seat.price,
    color: tooltip.seat.color
  })}
  style={{
    background: "#111",
    border: "none",
    padding: "3px 10px",
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "8px",
  }}
>
  🛒 Add to Cart
</button>


    {/* ✅ WhatsApp Booking */}
    <a
      href={`https://wa.me/123456789?text=Hello! I'm interested in booking Seat ${tooltip.seat.tableNumber}-${tooltip.seat.seatNo} (Price: ${Number(tooltip.seat.price).toFixed(3)} AED).`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        background: "#111",
        border: "none",
        padding: "3px 10px",
        borderRadius: 4,
        color: tooltip.seat.color,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "8px",
        textDecoration: "none",
      }}
    >
      💬 Chat
    </a>
  </div>
)}



          {/* Pointer */}
          <div
            style={{
              position: 'absolute',
              bottom: -7,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `10px solid ${tooltip.seat.color}`
            }}
          />
        </div>
      )}

      {/* ✅ Zoom Controls */}
      <div className='zoom-wrap'>
<div className='zoom'
      >
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
<button
            onClick={() => setZoom(z => Math.max(minZoom, +(z - (isMobile ? 0.6 : 0.23)).toFixed(2)))}

          style={{
            background: '#f5c400',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#111'
          }}
        >
          −
        </button>
        <span style={{ color: '#fff', fontSize: '20px' }} className='zoom-text'>Zoom</span>
        <button
          onClick={() => setZoom(z => Math.min(maxZoom, +(z + (isMobile ? 0.6 : 0.23)).toFixed(2)))}

          style={{
            background: '#f5c400',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#111'
          }}
        >
          +
        </button>
        </div>
        
        <span className='stage2'>Note:&nbsp;&nbsp;Please use the zoom buttons for better visualization.</span>
      </div>
      </div>
      
     <button
  onClick={() => setShowCart(!showCart)}
  style={{
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 9999,
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255, 255, 255, 0.12)", // Glass effect
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s ease",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
  }}
  onMouseEnter={(e) => (e.target.style.transform = "scale(1.12)")}
  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
>
  {showCart ? "✖" : "🛒"}
</button>



      {/* Side Cart Slider */}
<div
  ref={cartRef}
  className="side-cart"
  style={{
    position: 'fixed',
    top: 0,
    right: 0,
    width: 360,
    height: '100vh',
    background: '#1a1a1a',
    color: '#fff',
    transform: showCart ? "translateX(0)" : "translateX(360px)",
    transition: "transform 0.35s ease",
    padding: '24px 20px',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '-5px 0 20px rgba(0,0,0,0.5)',
    borderLeft: '1px solid #333',
    fontFamily: 'Arial, sans-serif',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch', // Safari fix
  }}
>

  {/* Cart Content */}
  <div style={{ flexGrow: 1, overflowY: 'auto', paddingTop: 40 }}>
    <h2 style={{ marginBottom: 16, fontSize: 20, borderBottom: '1px solid #333', paddingBottom: 8 }}>🛒 Your Cart</h2>
    
    {cartItems.length === 0 ? (
      <p style={{ color: '#aaa', fontSize: 14 }}>No seats added yet.</p>
    ) : (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {cartItems.map((item) => (
          <li
            key={`${item.tableNumber}-${item.seatNo}`}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #333',
              fontSize: 14,
            }}
          >
            <div>
              Table <strong>{item.tableNumber}</strong> - Seat <strong>{item.seatNo}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{item.price.toFixed(3)} AED</span>
              <button
                onClick={() => removeFromCart(item)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f5c400',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 600,
                }}
                title="Remove"
              >
                ✖
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}

    {cartItems.length > 0 && (
  <button
    onClick={() => setShowUserForm(true)} 
    style={{
      background: '#f5c400',
      border: 'none',
      padding: '12px 0',
      borderRadius: 8,
      fontWeight: 700,
      cursor: 'pointer',
      width: '100%',
      color: '#111',
      fontSize: 16,
      marginTop: 16,
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#e0b700'}
    onMouseLeave={e => e.currentTarget.style.background = '#f5c400'}
  >
    Checkout
  </button>
)}
  </div>

  {/* Checkout Button */}
  

</div>
{/* // 1️⃣ Name & Email Popup */}
{showUserForm && (
  <div style={popupOverlay}>
    <div style={userFormContainer}>
      <button onClick={() => setShowUserForm(false)} style={closeButton}>✖</button>
      <h3 style={{ marginBottom: 20 ,textAlign:'center', color:"black",fontWeight:'900'}}>Enter Your Details</h3>

      {/* Name */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Email */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Phone */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Phone</label>
        <input
          type="tel"
          placeholder="Enter your phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => setShowUserForm(false)}
          style={cancelButtonStyle}
        >
          Cancel
        </button>

        <button
          style={continueButtonStyle}
          onClick={() => {
            if (!customerName || !customerEmail || !customerPhone) {
              return alert("Fill all fields");
            }
            setShowUserForm(false);
            setShowPayment(true);
          }}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  </div>
)}




{/* // 2️⃣ StripePaymentPopup */}
<StripePaymentPopup
  open={showPayment}
  onClose={() => setShowPayment(false)}
  items={cartItems}
  customerName={customerName}   // pass name
  customerEmail={customerEmail} // pass email
  customerPhone={customerPhone} // pass email
 onSuccess={() => {
  setCartItems([]);
  setShowPayment(false);

  alert("Payment successful!");

  setTimeout(() => {
    window.location.reload();
  }, 800); // small delay ensures refresh happens AFTER clicking OK
}}

/>


    </div>
  )
}
const popupOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
};

const userFormContainer = {
  width: 420,
  background: "#fff",
  borderRadius: 10,
  padding: 20,
  position: "relative",
};

const closeButton = {
  position: "absolute",
  right: 10,
  top: 10,
  fontSize: 20,
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  color: "black",
  fontSize: 15,
};

const labelStyle = {
  fontWeight: 600,
  marginBottom: 6,
  display: "block",
  color: "black",
};

const cancelButtonStyle = {
  padding: "10px 16px",
  borderRadius: 6,
  background: "#ddd",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const continueButtonStyle = {
  padding: "10px 16px",
  borderRadius: 6,
  background: "#f5c400",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};
