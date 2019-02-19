<?php

namespace App\Http\Controllers\Api;

use App\Project;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Project::all(), 200);
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
     * @param User $user
     * @param Request $request
     * @return Response
     */
    public function store(User $user, Request $request)
    {
        return response()->json(array(
            'project'=>$user->projects()->create(['title' => $request->get('title')]),
            'message'=>"Project created successfully"
        ), 200);
    }

    /**
     * Display the specified resource.
     *
     * @param Project $project
     * @return Response
     */
    public function show(Project $project)
    {
        return response()->json($project, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
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
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Project $project
     * @return Response
     * @throws \Exception
     */
    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(array(
            'message'=>'Project deleted successfully'
        ),200);
    }

    public function deleteTasks(Project $project){
        $project->tasks()->delete();
        return response()->json(array(
            'message'=>'Tasks deleted successfully'
        ),200);
    }

    public function getTasks(Project $project)
    {
        return response()->json($project->tasks);
    }

    public function getCompleted(Project $project)
    {
        return response()->json($project->tasks->where('completed', true)->pluck('id'));
    }
}
