async function changeTaskCloseStateApi(taskId, stateClosed) {
    return new Promise((resolve, reject) => {
        fetch(`/api/tasks/change_close_state`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskId: taskId,
                stateClosed: stateClosed
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resolve(data.data)
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            reject(error)
        });
    })
}
function getAllTasksWithParentProjectIdApi(taskId) {
    return new Promise((resolve, reject) => {

        fetch(`/api/get_all_results_with_parent_task_id?parent_task_id=${taskId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                resolve(data.tasks); // Resolve with the tasks data
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                reject(error); // Reject with the error
            });
    });
}
