$(document).ready(function () {
    const $display = $('#display');
    const $output = $('#output');
    const $history = $('#history-list');
    const link = 'http://localhost:3000/history';

    $('.keypad button').on('click', function () {
        const action = $(this).data('action');
        const value = $(this).data('value');

        if (action === 'clear') {
            $display.val('');
            $output.text('0');
        } else if (action === 'backspace') {
            $display.val($display.val().slice(0, -1));
        } else if (action === 'calculate') {
            try {
                let expression = $display.val();
                if (!expression) return;


                expression = expression.replace(/(\d)\(/g, '$1*(');
                expression = expression.replace(/\)(\d)/g, ')*$1');

                const result = eval(expression);

                if (!isFinite(result)) {
                    alert("Division by zero is not allowed.");
                    return;
                }

                const rounded = parseFloat(result.toFixed(3));
                const entry = `${$display.val()} = ${rounded}`;
                $output.text(rounded);

                $.ajax({
                    url: link,
                    type: "POST",
                    data: JSON.stringify({ entry }),
                    contentType: "application/json",
                    success: getHistory
                });

            } catch {
                alert("Invalid expression");
            }
        } else {
            $display.val($display.val() + value);
        }
    });


    $('#clear-history').click(function () {
        $.get(link, function (data) {
            data.forEach(item => {
                $.ajax({
                    url: `${link}/${item.id}`,
                    type: 'DELETE',
                    success: getHistory
                });
            });
        });
        $output.text('0');
        $display.val('');
    });

    function getHistory() {
        $.get(link, data => {
            $history.empty();
            data.reverse().forEach(item => {
                const $li = $(`<li>${item.entry}</li>`);
                $li.on('click', () => {
                    const parts = item.entry.split('=');
                    if (parts.length === 2) {
                        $display.val(parts[0].trim());
                        $output.text(parts[1].trim());
                    }
                });
                $history.append($li);
            });
        });
    }

    getHistory();
});
