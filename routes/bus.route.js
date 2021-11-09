const router = require('express').Router();
const {
  createBusSchedule,
  showAllBus,
  updateBusSchedule,
  deleteBusSchedule,
} = require('../controller/busScheduleController');
const {
  createBusProvider,
  updateBusProvider,
  readBusProvider,
} = require('../controller/busProviderController');
const {
  createShuttle,
  findShuttleById,
  showAllShuttle,
  deleteShuttle,
} = require('../controller/shuttleController');
const {
  createProviderValidate,
  createScheduleValidate,
  createShuttleValidate,
} = require('../middleware/validation/busValidation');

router.get('/provider', readBusProvider);
router.post('/provider', createProviderValidate, createBusProvider);
router.patch('/provider', updateBusProvider);

router.get('/shuttle', showAllShuttle);
router.get('/shuttle/:id', findShuttleById);
router.post('/shuttle', createShuttleValidate, createShuttle);
router.delete('/shuttle/', deleteShuttle);

router.get('/schedule', showAllBus);
router.post('/schedule', createScheduleValidate, createBusSchedule);
router.patch('/schedule/:id', updateBusSchedule);
router.delete('/schedule/:id', deleteBusSchedule);

module.exports = router;
