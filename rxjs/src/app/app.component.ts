import { Component, AfterViewInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('cbUserDiv') userCbName: ElementRef;
  @ViewChild('cbFetchBtn') userCbNameBtn: ElementRef;
  @ViewChild('pUserDiv') userPName: ElementRef;
  @ViewChild('pFetchBtn') userPNameBtn: ElementRef;
  @ViewChild('obUserDiv') userObName: ElementRef;
  @ViewChild('obFetchBtn') userObNameBtn: ElementRef;
  globalListenFunc: Function;

  /* Call Back Start */

  setCbText = (text) => {
    this.userCbName.nativeElement.textContent = text;
  }

  checkCbAuth = cb => {
    this.setCbText('Checking Auth...');
    setTimeout(() => {
      cb(true);
    }, 2000);
  }

  fetchCbUser = cb => {
    this.setCbText('Fetching User...');
    setTimeout(() => {
      cb({ name: 'Ganesh' });
    }, 2000);
  }

  /* Call Back End */

  /* Promise Start */

  setPText = (text) => {
    this.userPName.nativeElement.textContent = text;
  }

  checkPAuth = () => {
    return new Promise((resolve, reject) => {
      this.setPText('Checking Auth...');
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }

  fetchPUser = () => {
    return new Promise((resolve, reject) => {
      this.setPText('Fetching User...');
      setTimeout(() => {
        resolve({ name: 'Abhijit' });
      }, 2000);
    });
  }

  /* Promise End */

  /* Observables Start */

  setObText = (text) => {
    this.userObName.nativeElement.textContent = text;
  }

  checkObAuth = () => {
    return Observable.create(observer => {
      this.setObText('Checking Auth...');
      setTimeout(() => {
        observer.next(true);
      }, 2000);
    });
  }

  fetchObUser = () => {
    return Observable.create(observer => {
      this.setObText('Fetching User...');
      setTimeout(() => {
        observer.next({name: 'Mitesh'});
      }, 2000);
    });
  }

  /* Observables End */

  constructor(private renderer: Renderer2, private el: ElementRef) {

  }

  ngAfterViewInit() {

    // Call Back Listener Register
    this.globalListenFunc = this.renderer.listen(this.userCbNameBtn.nativeElement, 'click', (event) => {
      this.checkCbAuth(auth => {
        if (auth) {
          this.fetchCbUser(user => {
            this.setCbText(user.name);
          });
        }
      });
    });

    // Promise Listener Register
    this.globalListenFunc = this.renderer.listen(this.userPNameBtn.nativeElement, 'click', (event) => {
      this.checkPAuth()
         .then(
            isAuth => {
              if (isAuth) {
                return this.fetchPUser();
              }
            }
          )
          .then(
            (user: any) => {
              this.setPText(user.name);
            }
          );
    });

    // Observable Register
    const observable = fromEvent(this.userObNameBtn.nativeElement, 'click');
    observable.pipe(
      switchMap(event => this.checkObAuth())
    ).pipe(
      switchMap(isAuth => {
        if (isAuth) {
          return this.fetchObUser();
        }
      })
    ).subscribe((user: any) => {
      this.setObText(user.name);
    });

  }

}
