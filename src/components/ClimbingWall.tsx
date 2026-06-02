import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { slides } from '../data';

const random = (seed: number) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const W = 300; 
const VIEW_H = 340;
const LEVEL_H = 75;
const STEPS_PER_LEVEL = 4;
const TOTAL_H = slides.length * LEVEL_H;

// Limb lengths set to realistic proportions
const ARM_L1 = 28;
const ARM_L2 = 28;
const LEG_L1 = 34;
const LEG_L2 = 34;
const MAX_VERTICAL_REACH = (LEG_L1 + LEG_L2) + 30 + (ARM_L1 + ARM_L2) - 25;

interface Pose {
  body: { x: number, y: number };
  lh: { x: number, y: number };
  rh: { x: number, y: number };
  lf: { x: number, y: number };
  rf: { x: number, y: number };
  ls: { x: number, y: number };
  rs: { x: number, y: number };
  lhip: { x: number, y: number };
  rhip: { x: number, y: number };
  lelbow: { x: number, y: number };
  relbow: { x: number, y: number };
  lknee: { x: number, y: number };
  rknee: { x: number, y: number };
  movingLimb?: string | null;
}

const calculateJoint = (p0: {x: number, y: number}, p2: {x: number, y: number}, l1: number, l2: number, flip: boolean) => {
    const dx = p2.x - p0.x;
    const dy = p2.y - p0.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d >= l1 + l2) {
        return { x: p0.x + (dx * l1 / d), y: p0.y + (dy * l1 / d) };
    }
    const a = Math.acos(Math.max(-1, Math.min(1, (l1*l1 + d*d - l2*l2) / (2 * l1 * d))));
    const theta = Math.atan2(dy, dx);
    const angle = flip ? theta - a : theta + a;
    return { x: p0.x + Math.cos(angle) * l1, y: p0.y + Math.sin(angle) * l1 };
}

const enforceReach = (p0: {x: number, y: number}, p2: {x: number, y: number}, maxLen: number) => {
    const dx = p2.x - p0.x;
    const dy = p2.y - p0.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d > maxLen * 0.98) { 
        return { x: p0.x + dx * (maxLen * 0.98) / d, y: p0.y + dy * (maxLen * 0.98) / d };
    }
    return p2;
}

export const ClimbingWall = ({ currentIndex }: { currentIndex: number }) => {
  const [climbStep, setClimbStep] = useState(currentIndex * STEPS_PER_LEVEL);

  useEffect(() => {
    const target = currentIndex * STEPS_PER_LEVEL;
    if (climbStep !== target) {
      const direction = climbStep < target ? 1 : -1;
      const interval = setInterval(() => {
        setClimbStep(curr => {
          if (curr + direction === target) {
            clearInterval(interval);
          }
          return curr + direction;
        });
      }, 800); // Slower interval for secure three-point contact feeling
      return () => clearInterval(interval);
    }
  }, [currentIndex, climbStep]);

  const { poses, targetHolds, extraHolds } = useMemo(() => {
    const N = slides.length * STEPS_PER_LEVEL;
    const posesArr: Pose[] = [];
    const holdPaths = [
      "M 0,-14 C 12,-16 18,-4 12,8 C 6,20 -10,16 -16,6 C -20,-6 -10,-10 0,-14 Z",
      "M -2,-13 C 8,-16 18,-6 14,4 C 10,14 -4,18 -14,8 C -22,-2 -12,-10 -2,-13 Z",
      "M 3,-12 C 14,-14 20,0 14,12 C 6,22 -8,18 -14,8 C -18,-2 -6,-8 3,-12 Z",
      "M -6,-8 C 8,-18 16,8 6,18 C -6,28 -18,8 -6,-8 Z"
    ];
    const holdColors = ['#6B4BA1', '#F4AA1A', '#3C8052', '#CC3B53'];

    let holds: any[] = [];
    const getHold = (x: number, y: number, id: string) => ({
        x, y, 
        shape: holdPaths[Math.floor(random(x+y+1)*holdPaths.length)], 
        color: holdColors[Math.floor(random(x+y+2)*holdColors.length)], 
        id,
        scale: 0.7 + random(x+y)*0.5,
        rot: random(x)*360
    });

    const startY = TOTAL_H - LEVEL_H / 2;
    let limbs = {
      lh: { x: W / 2 - 18, y: startY - 30 },
      rh: { x: W / 2 + 18, y: startY - 10 },
      lf: { x: W / 2 - 20, y: startY + 30 },
      rf: { x: W / 2 + 20, y: startY + 40 }
    };

    const cycleMap = ["lh", "rf", "rh", "lf"];

    holds.push(getHold(limbs.lh.x, limbs.lh.y, `start_lh`));
    holds.push(getHold(limbs.rh.x, limbs.rh.y, `start_rh`));
    holds.push(getHold(limbs.lf.x, limbs.lf.y, `start_lf`));
    holds.push(getHold(limbs.rf.x, limbs.rf.y, `start_rf`));

    for (let i = 0; i <= N + 2; i++) { 
      let movingLimb: string | null = null;
      if (i > 0) {
        movingLimb = cycleMap[(i - 1) % 4];
        let newY, newX;
        
        if (movingLimb === 'lh' || movingLimb === 'rh') {
           newY = limbs[movingLimb as keyof typeof limbs].y - LEVEL_H + (random(i) - 0.5)*15;
           const lowestFootY = Math.max(limbs.lf.y, limbs.rf.y);
           if (lowestFootY - newY > MAX_VERTICAL_REACH) {
               newY = lowestFootY - MAX_VERTICAL_REACH;
           }
           newX = W / 2 + (movingLimb === 'rh' ? 1 : -1) * (18 + random(i+1)*8);
        } else {
           newY = limbs[movingLimb as keyof typeof limbs].y - LEVEL_H + (random(i) - 0.5)*15;
           
           const highestHandY = Math.min(limbs.lh.y, limbs.rh.y);
           if (newY - highestHandY > MAX_VERTICAL_REACH) {
               newY = highestHandY + MAX_VERTICAL_REACH;
           }

           const lowestHandY = Math.max(limbs.lh.y, limbs.rh.y);
           // Cap the foot height so it does not exceed the hands
           if (newY < lowestHandY + 25) {
               newY = lowestHandY + 25;
           }
           newX = W / 2 + (movingLimb === 'rf' ? 1 : -1) * (18 + random(i+1)*12);
        }
        
        limbs = { ...limbs, [movingLimb]: { x: newX, y: newY } };
        holds.push(getHold(newX, newY, `h_${i}_${movingLimb}`));
      }

      // Re-calculate after limb movement for this state's pose
      const avgFootY = (limbs.lf.y + limbs.rf.y) / 2;
      const avgHandY = (limbs.lh.y + limbs.rh.y) / 2;
      let newBodyY = avgFootY * 0.6 + avgHandY * 0.4 - 15;
      const newBodyX = (limbs.lh.x + limbs.rh.x + limbs.lf.x + limbs.rf.x) / 4;

      // Secure physical body bounds to ensure holds are reachable!
      const minBodyYFromLegs = Math.max(limbs.lf.y, limbs.rf.y) - (LEG_L1 + LEG_L2) - 16 + 5; 
      const maxBodyYFromArms = Math.min(limbs.lh.y, limbs.rh.y) + (ARM_L1 + ARM_L2) + 14 - 5;

      if (newBodyY < minBodyYFromLegs) newBodyY = minBodyYFromLegs;
      if (newBodyY > maxBodyYFromArms) newBodyY = maxBodyYFromArms;

      const ls = { x: newBodyX - 14, y: newBodyY - 14 };
      const rs = { x: newBodyX + 14, y: newBodyY - 14 };
      const lhip = { x: newBodyX - 11, y: newBodyY + 16 };
      const rhip = { x: newBodyX + 11, y: newBodyY + 16 };

      const e_lh = enforceReach(ls, limbs.lh, ARM_L1 + ARM_L2);
      const e_rh = enforceReach(rs, limbs.rh, ARM_L1 + ARM_L2);
      const e_lf = enforceReach(lhip, limbs.lf, LEG_L1 + LEG_L2);
      const e_rf = enforceReach(rhip, limbs.rf, LEG_L1 + LEG_L2);

      const lelbow = calculateJoint(ls, e_lh, ARM_L1, ARM_L2, true);
      const relbow = calculateJoint(rs, e_rh, ARM_L1, ARM_L2, false);
      const lknee = calculateJoint(lhip, e_lf, LEG_L1, LEG_L2, false);
      const rknee = calculateJoint(rhip, e_rf, LEG_L1, LEG_L2, true);

      posesArr.push({ 
        body: {x: newBodyX, y: newBodyY}, 
        lh: e_lh, rh: e_rh, lf: e_lf, rf: e_rf, 
        ls, rs, lhip, rhip, 
        lelbow, relbow, lknee, rknee,
        movingLimb
      });
    }

    const extraHolds: any[] = [];
    const numExtras = 0;
    const EXTRA_H = TOTAL_H + VIEW_H;
    for(let i = 0; i < numExtras; i++) {
        extraHolds.push({
            x: 10 + random(i*100)* (W - 20),
            y: TOTAL_H + VIEW_H/2 - random(i*100+1) * EXTRA_H,
            shape: holdPaths[Math.floor(random(i*100+2) * holdPaths.length)],
            color: holdColors[Math.floor(random(i*100+3) * holdColors.length)],
            id: `ex_${i}`,
            scale: 0.4 + random(i*100+4)*0.5,
            rot: random(i*100+5)*360
        });
    }

    return { poses: posesArr, targetHolds: holds, extraHolds };
  }, []);

  const currentPose = poses[Math.min(climbStep, poses.length - 1)];
  const motionConfig = { type: 'tween' as const, duration: 0.6, ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number] };
  const groupY = -(currentPose.body.y - VIEW_H/2);

  const drawLimb = (p1: {x:number, y:number}, p2: {x:number, y:number}, p3: {x:number, y:number}, width: number, shoeRot?: number) => (
       <g>
           <motion.line 
              initial={false}
              animate={{ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }}
              stroke="#B78864" strokeWidth={width} strokeLinecap="round"
              transition={motionConfig}
           />
           <motion.circle
              initial={false}
              animate={{ cx: p2.x, cy: p2.y }}
              r={width / 2}
              fill="#B78864"
              transition={motionConfig}
           />
           <motion.line 
              initial={false}
              animate={{ x1: p2.x, y1: p2.y, x2: p3.x, y2: p3.y }}
              stroke="#B78864" strokeWidth={width} strokeLinecap="round"
              transition={motionConfig}
           />
           {shoeRot !== undefined && (
               <motion.ellipse
                  initial={false}
                  animate={{ cx: p3.x, cy: p3.y, rotate: shoeRot }}
                  rx="8" ry="5" fill="#252525" 
                  transition={motionConfig}
               />
           )}
       </g>
  );

  const renderHold = (h: any) => (
      <g key={h.id} transform={`translate(${h.x}, ${h.y}) scale(${h.scale || 1}) rotate(${h.rot || 0})`}>
          {/* Drop shadow */}
          <path d={h.shape} fill="rgba(0,0,0,0.15)" transform="translate(3, 4)" />
          {/* Main color */}
          <path d={h.shape} fill={h.color} />
          {/* Top highlight for volume */}
          <path d={h.shape} fill="rgba(255,255,255,0.2)" transform="scale(0.85) translate(-1, -2)" />
          {/* Inner screw hole */}
          <circle cx="0" cy="0" r="2" fill="rgba(0,0,0,0.4)" />
      </g>
  );

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className="overflow-visible bg-[#D1CFCA]">
       <motion.g animate={{ y: groupY }} transition={motionConfig}>
           
           <defs>
               <pattern id="wallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                   <circle cx="2" cy="2" r="1.5" fill="#2C2C2C" opacity="0.15" />
               </pattern>
           </defs>
           <rect x="-100%" y={-VIEW_H} width="300%" height={TOTAL_H + VIEW_H*2} fill="url(#wallGrid)" />

           {extraHolds.map(renderHold)}
           {targetHolds.map(renderHold)}

           {/* The Climber Avatar */}
           <g className="climber-group">
               {/* Limbs colored with skin tone */}
               {drawLimb(currentPose.ls, currentPose.lelbow, currentPose.lh, 7)}
               {drawLimb(currentPose.rs, currentPose.relbow, currentPose.rh, 7)}
               {drawLimb(currentPose.lhip, currentPose.lknee, currentPose.lf, 9, -30)}
               {drawLimb(currentPose.rhip, currentPose.rknee, currentPose.rf, 9, 30)}
               
               <motion.g
                  initial={false}
                  animate={{ x: currentPose.body.x, y: currentPose.body.y }}
                  transition={motionConfig}
               >
                  {/* Neck */}
                  <path d="M -4 -12 L 4 -12 L 4 -28 L -4 -28 Z" fill="#B78864" />
                  
                  {/* Shorts */}
                  <path d="M -15 6 Q 0 8 15 6 L 12 20 Q 0 15 -12 20 Z" fill="#2D3243" />
                  
                  {/* Shirt */}
                  <path d="M -16 -12 C -18 -20 18 -20 16 -12 L 14 10 Q 0 14 -14 10 Z" fill="#BC5D7A" />
                  
                  {/* Chalk Bag */}
                  <g transform="translate(-10, 10) rotate(-10)">
                     <path d="M -5 0 L 5 0 L 4 9 C 4 13 -4 13 -4 9 Z" fill="#A49882" />
                     <ellipse cx="0" cy="0" rx="5" ry="2" fill="#1A1A1A" />
                     <ellipse cx="0" cy="0" rx="4" ry="1.2" fill="#E8E6E1" opacity="0.9" />
                  </g>
               </motion.g>

               {/* Head */}
               <motion.g
                  initial={false}
                  animate={{ 
                      x: currentPose.body.x + (currentPose.rh.x - currentPose.lh.x)*0.03, 
                      y: currentPose.body.y - 30 
                  }}
                  transition={motionConfig} 
               >
                  <circle cx="0" cy="0" r="11" fill="#B78864" />
                  {/* Hair */}
                  <path d="M -11 0 C -11 -14 11 -14 11 0 C 11 4 7 3 5 1 C 2 -3 -2 -3 -5 1 C -7 3 -11 4 -11 0 Z" fill="#2A2A2A" />
               </motion.g>
           </g>

           {/* Chalk Dust Effect */}
           {currentPose.movingLimb && (currentPose.movingLimb === 'lh' || currentPose.movingLimb === 'rh') && (
               <motion.g 
                   key={`dust-${climbStep}`}
                   initial={{ opacity: 0.8, scale: 0.5 }}
                   animate={{ opacity: 0, scale: 2.5 }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                   transform={`translate(${currentPose.movingLimb === 'lh' ? currentPose.lh.x : currentPose.rh.x}, ${currentPose.movingLimb === 'lh' ? currentPose.lh.y : currentPose.rh.y})`}
               >
                   <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.7)" />
                   <circle cx="-6" cy="4" r="5" fill="rgba(255,255,255,0.5)" />
                   <circle cx="5" cy="-5" r="6" fill="rgba(255,255,255,0.6)" />
               </motion.g>
           )}
        </motion.g>
     </svg>
  );
};

