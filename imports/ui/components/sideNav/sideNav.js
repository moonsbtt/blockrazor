import {FlowRouter} from 'meteor/ostrio:flow-router-extra';

import './sideNav.html'
import './sideNav.scss'
import '../global/globalHelpers'

import { colStub } from '/imports/ui/components/compatability/colStub'

Wallet = ActivityLog = UserData = colStub

Template.sideNav.helpers({
    activityNotifications() {
        return ActivityLog.find({ owner: Meteor.userId(), type: "message", read: { $ne: true } }).count()
    },
    walletNotifications() {
        return Wallet.find({ owner: Meteor.userId(), type: "transaction", read: { $ne: true } }).count()
    },
    balance() {
      let balance = UserData.findOne({}, { fields: { balance: 1 } }).balance
      return Number( balance.toPrecision(3) )
    },
    activeClass: function(route) {
        if (FlowRouter.getRouteName() === route) {
                return 'active';
            }
        }
});

Template.sideNav.onCreated(async function() {
  ({ ActivityLog, UserData, Wallet } = (await import('/imports/api/indexDB')));
  colStub.change()

  this.autorun(()=> {
    this.subscribe('wallet');
    this.subscribe('activitylog');
  });
});

Template.sideNav.events({
  'click .nav-side-menu li a': function (event){
    if (Session.get("screenSize") == 0 && !event.target.parentElement.hasAttribute('data-toggle')){  // if not having submenu items
      Session.set("openedSidebar")
    }
  },
});