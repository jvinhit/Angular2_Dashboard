import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService, ObjectToArrayPipe, TitlePageService } from "../../shared";
import { Mission } from '../mission.interface';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

@Component({
    selector: "mission-detail",
    templateUrl: '/app/+mission/mission-detail/mission-detail.component.html',
    directives: [MD_BUTTON_DIRECTIVES, MD_CHECKBOX_DIRECTIVES, MD_INPUT_DIRECTIVES],
    providers: [DataService, ObjectToArrayPipe, ToastsManager, TitlePageService]
})

export class MissionDetailComponent implements OnInit {
    date: Date;
    date1: Date;
    date2: Date;
    data: any;
    list_collaborators: any[];
    mission: Mission;
    private sub; any;

    constructor(
        private _dataService: DataService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _objecToArray: ObjectToArrayPipe,
        private _toastr: ToastsManager,
        private _titlePageService: TitlePageService) {

    }

    cancel() {
        this._router.navigate(['/Home/Mission']);
    }

    onSubmit() {
        this.sub = this._route.params.subscribe(params => {
            let id = params['id'];
            this._dataService.setDataMission(id, this.mission);
            this._router.navigate(['/Home/Mission']);
            this._toastr.success('modifications saved');
        })
    }

    ngOnInit() {
        this._titlePageService.setTitle('Mission details');
        
        this.sub = this._route.params.subscribe(params => {
            let id = params['id'];
            this._dataService.getData('mission', id).then((snapshot) => {
                this.data = snapshot.val();
                this.mission = this.data;

                this.date = new Date();
                this.date1 = new Date(this.mission.dateStart)
                this.date2 = new Date(this.mission.dateEnd);
                if (this.date >= this.date1 && this.date <= this.date2) {
                    this.mission.active = true;
                    console.log('mission active')
                }
                else {
                    this.mission.active = false;
                    console.log('mission not actived')
                }
            })
        })

        this._dataService.getAllData('collaborator').then((snapshot) => {
            this.data = snapshot.val();
            if (this.data != null) {
                Object.keys(this.data).forEach((key) => {
                    if (!this.data[key].active) {
                        delete this.data[key];
                    }
                })
            }
            else {
                this._toastr.info("no employee exists. please create a collaborator to assign it to a mission");
            }

            this.list_collaborators = this._objecToArray.transform(this.data);
        })

    }
}
