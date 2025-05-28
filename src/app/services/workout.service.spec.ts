import { TestBed } from '@angular/core/testing';

import { WorkoutService } from './workout.service';
import { DataService, DBAction } from './data.service';
import { ProgressType, Remark, WeightType } from '../gym.model';

const existingExerciseType = {
  id: 0,
  name: 'exerciseType0',
  image: undefined,
};
const existingExercises = [
  {
    id: 0,
    type: 0,
    sets: [],
    weightType: WeightType.side,
    weighted: false,
    progressType: ProgressType.repetitions,
    restingTime: 1,
    remark: null,
  },
  {
    id: 1,
    type: 0,
    sets: [],
    weightType: WeightType.side,
    weighted: false,
    progressType: ProgressType.repetitions,
    restingTime: 1,
    remark: null,
  },
];
const existingWorkout = {
  id: 0,
  name: 'workout0',
  lastExecution: null,
  exercises: [0, { id: 0, exercises: [1] }],
};
const newExerciseType = { id: 1, name: 'exerciseType1' };
const newExercise = {
  ...existingExercises[0],
  id: 2,
  type: newExerciseType.id,
};
const newWorkout = {
  ...existingWorkout,
  id: 1,
  exercises: [...existingWorkout.exercises, newExercise.id],
};

describe('WorkoutService', () => {
  let service: WorkoutService;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  beforeEach(() => {
    dataServiceSpy = jasmine.createSpyObj(
      'DataService',
      ['batchExecute', 'getAllData', 'getData', 'updateData'],
      {
        workoutStoreName: 'workoutStoreName',
        exerciseTypeStoreName: 'exerciseTypeStoreName',
        exerciseStoreName: 'exerciseStoreName',
      },
    );
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DataService,
          useValue: dataServiceSpy,
        },
        WorkoutService,
      ],
    });
    dataServiceSpy.getAllData
      .withArgs(dataServiceSpy.workoutStoreName)
      .and.returnValue(
        new Promise((resolve, _) => {
          resolve([JSON.parse(JSON.stringify(existingWorkout))]);
        }),
      );
    dataServiceSpy.getAllData
      .withArgs(dataServiceSpy.exerciseTypeStoreName)
      .and.returnValue(
        new Promise((resolve, _) => {
          resolve([JSON.parse(JSON.stringify(existingExerciseType))]);
        }),
      );
    dataServiceSpy.getAllData
      .withArgs(dataServiceSpy.exerciseStoreName)
      .and.returnValue(
        new Promise((resolve, _) => {
          resolve(JSON.parse(JSON.stringify(existingExercises)));
        }),
      );
    dataServiceSpy.getData
      .withArgs(dataServiceSpy.workoutStoreName, jasmine.anything())
      .and.returnValue(
        new Promise((resolve, _) => {
          resolve(JSON.parse(JSON.stringify(existingWorkout)));
        }),
      );
    dataServiceSpy.getData
      .withArgs(dataServiceSpy.exerciseStoreName, jasmine.anything())
      .and.returnValue(
        new Promise((resolve, _) => {
          resolve(JSON.parse(JSON.stringify(existingExercises[0])));
        }),
      );
    service = TestBed.inject(WorkoutService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init', async () => {
    await service.init();
    const expectedExerciseType = {
      id: 0,
      name: 'exerciseType0',
    };
    expect(service.exerciseTypes()).toEqual([expectedExerciseType]);
    const expectedExercise0 = {
      id: 0,
      type: expectedExerciseType,
      sets: [],
      weightType: WeightType.side,
      weighted: false,
      progressType: ProgressType.repetitions,
      restingTime: 1,
      remark: null,
    };
    const expectedExercise1 = {
      id: 1,
      type: expectedExerciseType,
      sets: [],
      weightType: WeightType.side,
      weighted: false,
      progressType: ProgressType.repetitions,
      restingTime: 1,
      remark: null,
    };
    expect(service.exercises()).toEqual([expectedExercise0, expectedExercise1]);
    expect(service.workouts()).toEqual([
      {
        id: 0,
        name: 'workout0',
        lastExecution: null,
        exercises: [
          expectedExercise0,
          {
            id: 0,
            exercises: [expectedExercise1],
          },
        ],
      },
    ]);
  });

  it('#addWorkout should add a new workout correctly', async () => {
    await service.init();
    const newExerciseType = {
      id: 1,
      name: 'exerciseType1',
      image: undefined,
    };
    const newExercise1 = {
      id: 2,
      type: existingExerciseType,
      sets: [],
      weightType: WeightType.side,
      weighted: false,
      progressType: ProgressType.repetitions,
      restingTime: 1,
      remark: null,
    };
    const expectedNewExercise1 = {
      ...newExercise1,
      type: newExercise1.type.id,
    };
    const newExercise2 = {
      id: 3,
      type: newExerciseType,
      sets: [],
      weightType: WeightType.side,
      weighted: false,
      progressType: ProgressType.repetitions,
      restingTime: 1,
      remark: null,
    };
    const expectedNewExercise2 = {
      ...newExercise2,
      type: newExercise2.type.id,
    };

    const workout = {
      id: 1,
      name: 'workout1',
      lastExecution: null,
      exercises: [
        newExercise1,
        { ...existingExercises[0], type: existingExerciseType },
        {
          id: 0,
          exercises: [
            { ...existingExercises[1], type: existingExerciseType },
            newExercise2,
          ],
        },
      ],
    };
    const expectedWorkout = {
      ...workout,
      exercises: [
        expectedNewExercise1.id,
        existingExercises[0].id,
        {
          id: 0,
          exercises: [existingExercises[1].id, expectedNewExercise2.id],
        },
      ],
    };
    await service.addWorkout(workout);
    expect(dataServiceSpy.batchExecute).toHaveBeenCalledWith([
      {
        name: 'add',
        storeName: dataServiceSpy.exerciseTypeStoreName,
        data: newExerciseType,
      },
      {
        name: 'add',
        storeName: dataServiceSpy.exerciseStoreName,
        data: expectedNewExercise1,
      },
      {
        name: 'add',
        storeName: dataServiceSpy.exerciseStoreName,
        data: expectedNewExercise2,
      },
      {
        name: 'update',
        storeName: dataServiceSpy.exerciseStoreName,
        data: existingExercises[0],
      },
      {
        name: 'update',
        storeName: dataServiceSpy.exerciseStoreName,
        data: existingExercises[1],
      },
      {
        name: 'add',
        storeName: dataServiceSpy.workoutStoreName,
        data: expectedWorkout,
      },
    ]);
  });

  it('#editWorkout should edit a workout correctly', async () => {
    await service.init();
    const newExerciseType = {
      id: 1,
      name: 'exerciseType1',
      image: undefined,
    };
    const newExercise1 = {
      id: 2,
      type: existingExerciseType,
      sets: [],
      weightType: WeightType.side,
      weighted: false,
      progressType: ProgressType.repetitions,
      restingTime: 1,
      remark: null,
    };
    const expectedNewExercise1 = {
      ...newExercise1,
      type: newExercise1.type.id,
    };
    const newExercise2 = {
      id: 3,
      type: newExerciseType,
      sets: [],
      weightType: WeightType.side,
      weighted: false,
      progressType: ProgressType.repetitions,
      restingTime: 1,
      remark: null,
    };
    const expectedNewExercise2 = {
      ...newExercise2,
      type: newExercise2.type.id,
    };

    const workout = {
      id: 0,
      name: 'workout0',
      lastExecution: null,
      exercises: [
        newExercise1,
        {
          id: 0,
          exercises: [
            { ...existingExercises[1], type: existingExerciseType },
            newExercise2,
          ],
        },
      ],
    };
    const expectedWorkout = {
      ...workout,
      exercises: [
        expectedNewExercise1.id,
        {
          id: 0,
          exercises: [existingExercises[1].id, expectedNewExercise2.id],
        },
      ],
    };
    await service.editWorkout(workout);
    expect(dataServiceSpy.batchExecute).toHaveBeenCalledWith([
      {
        name: 'add',
        storeName: dataServiceSpy.exerciseTypeStoreName,
        data: newExerciseType,
      },
      {
        name: 'add',
        storeName: dataServiceSpy.exerciseStoreName,
        data: expectedNewExercise1,
      },
      {
        name: 'add',
        storeName: dataServiceSpy.exerciseStoreName,
        data: expectedNewExercise2,
      },
      {
        name: 'update',
        storeName: dataServiceSpy.exerciseStoreName,
        data: existingExercises[1],
      },
      {
        name: 'delete',
        storeName: dataServiceSpy.exerciseStoreName,
        data: existingExercises[0].id,
      },
      {
        name: 'update',
        storeName: dataServiceSpy.workoutStoreName,
        data: expectedWorkout,
      },
    ]);
  });

  it('#deleteWorkout should delete a workout correctly', async () => {
    await service.init();
    await service.deleteWorkout(0);
    expect(dataServiceSpy.batchExecute).toHaveBeenCalledWith([
      {
        name: 'delete',
        storeName: dataServiceSpy.exerciseStoreName,
        data: 0,
      },
      {
        name: 'delete',
        storeName: dataServiceSpy.exerciseStoreName,
        data: 1,
      },
      {
        name: 'delete',
        storeName: dataServiceSpy.workoutStoreName,
        data: 0,
      },
    ]);
  });

  it('#editExerciseType should edit an exercise type correctly', async () => {
    await service.init();
    const expectedExerciseType = {
      id: existingExerciseType.id,
      name: 'newName',
      image: undefined,
    };
    await service.editExerciseType(expectedExerciseType);
    expect(dataServiceSpy.updateData).toHaveBeenCalledWith(
      dataServiceSpy.exerciseTypeStoreName,
      expectedExerciseType,
    );
  });
  it('#deleteExerciseType should delete an exercise type correctly and delete workout when it has no other exercise types', async () => {
    await service.init();
    await service.deleteExerciseType(0);
    expect(dataServiceSpy.batchExecute).toHaveBeenCalledWith([
      {
        name: 'delete',
        storeName: dataServiceSpy.exerciseStoreName,
        data: 0,
      },
      {
        name: 'delete',
        storeName: dataServiceSpy.exerciseStoreName,
        data: 1,
      },
      {
        name: 'delete',
        storeName: dataServiceSpy.workoutStoreName,
        data: 0,
      },
      {
        name: 'delete',
        storeName: dataServiceSpy.exerciseTypeStoreName,
        data: 0,
      },
    ]);
  });
  it('#deleteExerciseType should delete an exercise type correctly and update workout when it has other exercise types', async () => {
    dataServiceSpy.getAllData
      .withArgs(dataServiceSpy.workoutStoreName)
      .and.returnValue(
        new Promise((resolve, _) => {
          resolve(JSON.parse(JSON.stringify([existingWorkout, newWorkout])));
        }),
      );
    dataServiceSpy.getAllData
      .withArgs(dataServiceSpy.exerciseTypeStoreName)
      .and.returnValue(
        new Promise((resolve, _) => {
          resolve(
            JSON.parse(JSON.stringify([existingExerciseType, newExerciseType])),
          );
        }),
      );
    dataServiceSpy.getAllData
      .withArgs(dataServiceSpy.exerciseStoreName)
      .and.returnValue(
        new Promise((resolve, _) => {
          resolve(
            JSON.parse(JSON.stringify([...existingExercises, newExercise])),
          );
        }),
      );
    service = TestBed.inject(WorkoutService);
    await service.init();
    await service.deleteExerciseType(1);
    const expectedDBActions = [
      {
        name: 'delete',
        storeName: dataServiceSpy.exerciseStoreName,
        data: 2,
      },
      {
        name: 'update',
        storeName: dataServiceSpy.workoutStoreName,
        data: { ...newWorkout, exercises: [...existingWorkout.exercises] },
      },
      {
        name: 'delete',
        storeName: dataServiceSpy.exerciseTypeStoreName,
        data: 1,
      },
    ] as DBAction[];
    expect(dataServiceSpy.batchExecute).toHaveBeenCalledWith(expectedDBActions);
  });

  it('#changeRemarkOfExercise should change the remark of an exercise correctly', async () => {
    await service.init();
    const expectedExercise = {
      ...existingExercises[0],
      remark: Remark.failed,
    };
    await service.changeRemarkOfExercise(
      existingExercises[0].id,
      Remark.failed,
    );
    expect(dataServiceSpy.updateData).toHaveBeenCalledWith(
      dataServiceSpy.exerciseStoreName,
      expectedExercise,
    );
  });
});
