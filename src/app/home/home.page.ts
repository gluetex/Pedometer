import { Component } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  stepCount: number = 0;
  goalSteps: number = 10000; 
  previousAcceleration: DeviceMotionAccelerationData | null = null; // Initialize with null
  isCounting: boolean = false;

  constructor(private deviceMotion: DeviceMotion) {}

  startCountingSteps() {
    this.isCounting = true;
    this.stepCount = 0;

    this.deviceMotion.watchAcceleration({ frequency: 200 }).subscribe(
      (acceleration: DeviceMotionAccelerationData) => {
        if (!this.previousAcceleration) {
          this.previousAcceleration = acceleration;
          return;
        }

        const deltaX = Math.abs(acceleration.x - this.previousAcceleration.x);
        const deltaY = Math.abs(acceleration.y - this.previousAcceleration.y);
        const deltaZ = Math.abs(acceleration.z - this.previousAcceleration.z);
        const deltaTotal = deltaX + deltaY + deltaZ;

        if (deltaTotal > 3 && !this.isCounting) {
          this.stepCount++;
          this.isCounting = true;
        } else if (deltaTotal < 1.5) {
          this.isCounting = false;
        }

        this.previousAcceleration = acceleration;
      },
      (error: any) => console.log(error)
    );
  }

  stopCountingSteps() {
    this.isCounting = false;
    this.previousAcceleration = null;
  }
}
