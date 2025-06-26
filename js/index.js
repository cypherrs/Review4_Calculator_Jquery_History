$(document).ready(function () {
    const $num1 = $('#num1');
    const $num2 = $('#num2');
    const $op = $('#operator');
    const $output = $('#output');
    const $history = $('#history-list');
    const link = 'http://localhost:3000/history';

    $('#calculate').click(`submit`,function(e){
        e.preventDefault();

        const n1 = Number($num1.val());
        const n2 = Number($num2.val());
        const op = $op.val();

        if (op === '/' && n2 === 0) {
            alert("you can't divide with 0");
            return;
        }

        let result;
        switch (op) {
            case '+': result = n1 + n2; break;
            case '-': result = n1 - n2; break;
            case '*': result = n1 * n2; break;
            case '/': result = n1 / n2; break;
        }

        const entry = `${n1} ${op} ${n2} = ${result}`;
        $output.text(result);

        $.ajax({
            url: link,
            type: "POST",
            data: JSON.stringify({ entry }),
            contentType: "application/json",
            success: getHistory
        });

        // $num1.val('');
        // $num2.val('');
    });

    function getHistory() {
        $.get(link, data => {
            $history.empty();
            data.reverse().forEach(item => {
                const $li = $(`<li>${item.entry}</li>`);
                $li.on('click', () => {
                    const parts = item.entry.split(' ');
                    $num1.val(parts[0]);
                    $op.val(parts[1]);
                    $num2.val(parts[2]);
                    $output.text(parts[4]);
                });
                $history.append($li);
            });
        });
    }

    getHistory();
});
