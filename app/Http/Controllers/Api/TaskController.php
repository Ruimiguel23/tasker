<?php

namespace App\Http\Controllers\Api;

use App\Project;
use App\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use PDO;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Task::all(),200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $task = new Task([
            'created_by_id'=>$request->get('user_id'),
            'project_id'=>$request->get('project_id'),
            'completed'=>false,
            'description'=>$request->get('description'),
            'parent_id'=>$request->get('parent_id'),
        ]);
        $task->save();
        return response()->json(array(
            'task'=>$task,
            'message'=>'Task created successfully'
        ),200);
    }

    /**
     * Display the specified resource.
     *
     * @param Task $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        return response()->json($task,200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Task $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        $task->description=$request->get('description');
        $task->save();
        return response()->json(array(
            'task'=>$task,
            'message'=>'Task edited successfully'
        ),200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Task $task
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(array(
            'message'=>'Task deleted successfully'
        ),200);
    }

    public function complete(Request $request){
        $tasks=$request->get('tasks');
        DB::table('tasks')
            ->whereIn('id',$tasks)
            ->update(array('completed'=>true));
        return response()->json(array(
            'message'=>'Task(s) status changed successfully',
        ),200);
    }

    public function incomplete(Request $request){
        $tasks=$request->get('tasks');
        DB::table('tasks')
            ->whereIn('id',$tasks)
            ->update(array('completed'=>false));
        return response()->json(array(
            'message'=>'Task(s) status changed successfully',
        ),200);
    }

}
