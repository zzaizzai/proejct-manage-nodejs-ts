
async function changeTaskCloseStateApi(taskId, stateClosed) {
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
        console.log(data.data);
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
}

async function getAllTasksWithParentProjectIdApi(button, taskId) {

    const taskListOfResult = button.closest('.task-item').querySelector('.list-group-item');

    // hide if show already
    if (taskListOfResult) {
        taskListOfResult.remove();
        return
    }

    fetch(`/api/get_all_results_with_parent_task_id?parent_project_id=${taskId}`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.tasks);

        data.tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = task.name; // 또는 task.description 등의 적절한 데이터를 사용합니다.
            

            // remove dupl
            if (taskListOfResult) {
                taskListOfResult.remove();
            }

            button.closest('.task-item').appendChild(listItem);
        });

    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
}