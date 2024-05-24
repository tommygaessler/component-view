import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  signatureEndpoint = 'https://26040c9x85.execute-api.us-west-1.amazonaws.com/default/meetingsdk'
  sdkKey = 'viodIoBwGbXY8HfsCADKrAIqOgdLuwLNPVUI'
  meetingNumber = ''
  role = 0
  userName = 'Zoom Meeting SDK'
  userEmail = ''
  passWord = ''
  registrantToken = ''
  zakToken = ''

  client = ZoomMtgEmbedded.createClient();

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document, private activatedRoute: ActivatedRoute, private ngZone: NgZone) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.meetingNumber = params['meeting'];
      this.passWord = params['passcode'];
    });
  }

  ngOnInit() {

  }

  getSignature() {
    this.httpClient.post(this.signatureEndpoint, JSON.stringify({
	    meetingNumber: this.meetingNumber,
	    role: this.role
    })).toPromise().then((data: any) => {
      if(data.signature) {
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature) {

    let meetingSDKElement = document.getElementById('meetingSDKElement');

    this.ngZone.runOutsideAngular(() => {
      this.client.init({ zoomAppRoot: meetingSDKElement, language: 'en-US', patchJsMedia: true, leaveOnPageUnload: true }).then(() => {
        this.client.join({
          sdkKey: this.sdkKey,
          signature: signature,
          meetingNumber: this.meetingNumber,
          password: this.passWord,
          userName: this.userName,
          userEmail: this.userEmail,
          tk: this.registrantToken,
          zak: this.zakToken
        }).then(() => {
          console.log('joined successfully')
        }).catch((error) => {
          console.log(error)
        })
      }).catch((error) => {
        console.log(error)
      })
    })
  }
}
