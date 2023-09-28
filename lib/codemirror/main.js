
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var dontTriggerSaveDiff = false;
 
 
function JsonInputView(el, initialText) {
    this.el = el;
    var codemirror  = this.codemirror = CodeMirror.fromTextArea(this.el, {
        autoRefresh: true,
        lineNumbers: true,
        mode: { name: "javascript", json: true },
        matchBrackets: true,
        theme: (window.$('#dark-mode-check').prop('checked') ? 'material' : 'default') ,
        readOnly : true
    });
    if (initialText) {
        codemirror.setValue(initialText);
    }
    var self = this;

    codemirror.on('inputRead', function (cm, e) {
        triggerChange();
    });
    codemirror.on('keyup', triggerChange);
    codemirror.on('change', triggerChange);
    codemirror.on('clear', function () {
        //console.log(arguments);
    });

    var oldValue = '';
    function triggerChange() {
        var text = codemirror.getValue();
        if (text !== oldValue) {
            autoFormat();
            self.trigger('change');

        }
        oldValue = text;
    }

    function autoFormat() { 
        var totalLines = codemirror.lineCount();
        codemirror.autoFormatRange({ line: 0, ch: 0 }, { line: totalLines });
        codemirror.setSelection({ line: 0, ch: 0 });
    }
}

JsonInputView.prototype.getText = function () {
    return this.codemirror.getValue();
};

JsonInputView.prototype.setText = function (text) {
    return this.codemirror.setValue(text);
};

JsonInputView.prototype.highlightRemoval = function (diff) {
    this._highlight(diff, '#F4ACB7');
};

JsonInputView.prototype.highlightAddition = function (diff) {
    this._highlight(diff, isLightTheme() ? '#D5F7C4' : '#D5F7C4');
};

JsonInputView.prototype.highlightChange = function (diff) {
    this._highlight(diff, isLightTheme() ? '#F7F0A8' : '#F7F0A8');
};

JsonInputView.prototype._highlight = function (diff, color) {
    var pos = getStartAndEndPosOfDiff(this.getText(), diff);
    this.codemirror.markText(pos.start, pos.end, {
        css: 'background-color: ' + color
    });
};

JsonInputView.prototype.clearMarkers = function () {
    this.codemirror.getAllMarks().forEach(function (marker) {
        marker.clear();
    });
};

function getStartAndEndPosOfDiff(textValue, diff) {
    var result = parse(textValue);
    var pointers = result.pointers;
    var path = diff.path;
    var start = {
        line: pointers[path].key ? pointers[path].key.line : pointers[path].value.line,
        ch: pointers[path].key ? pointers[path].key.column : pointers[path].value.column
    };
    var end = {
        line: pointers[path].valueEnd.line,
        ch: pointers[path].valueEnd.column
    };

    return {
        start: start,
        end: end
    }
}

function indexToPos(textValue, i) {
    var beginStr = textValue.substr(0, i);
    var lines = beginStr.split('\n');
    return {
        line: lines.length - 1,
        ch: lines[lines.length - 1].length
    };
}

function isLightTheme() {
    return $('body').hasClass('lighttheme');
}

BackboneEvents.mixin(JsonInputView.prototype);
var currentDiff = localStorage.getItem('current-diff') && JSON.parse(localStorage.getItem('current-diff'));

var leftInputView = new JsonInputView(document.getElementById('json-diff-left'), currentDiff && currentDiff.left);
var rightInputView = new JsonInputView(document.getElementById('json-diff-right'), currentDiff && currentDiff.right);
leftInputView.on('change', onInputChange);
rightInputView.on('change', onInputChange);
leftInputView.codemirror.on('scroll', function () {
    var scrollInfo = leftInputView.codemirror.getScrollInfo();
    rightInputView.codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
});
rightInputView.codemirror.on('scroll', function () {
    var scrollInfo = rightInputView.codemirror.getScrollInfo();
    leftInputView.codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
});

if (currentDiff) {
    compareJson();
}

function onInputChange() {
    compareJson();
    saveDiff();
}

function compareJson() {
    leftInputView.clearMarkers();
    rightInputView.clearMarkers();
    var leftText = leftInputView.getText(), rightText = rightInputView.getText();
    var leftJson, rightJson;
    try {
        if (leftText) {
            leftJson = JSON.parse(leftText);
        }
        if (rightText) {
            rightJson = JSON.parse(rightText);
        }
    } catch (e) {
    }
    if (!leftJson || !rightJson) return;
    var diffs = jsonpatch.compare(leftJson, rightJson);
    window.diff = diffs;

    diffs.forEach(function (diff) {
        try {
            if (diff.op === 'remove') {
                leftInputView.highlightRemoval(diff);
            } else if (diff.op === 'add') {
                rightInputView.highlightAddition(diff);
            } else if (diff.op === 'replace') {
                rightInputView.highlightChange(diff);
                leftInputView.highlightChange(diff);
            }
        } catch (e) {
            console.warn('error while trying to highlight diff', e);
        }
    });
}

function saveDiff() {
    if (!localStorage.getItem('dont-save-diffs')) {
        var currentDiff = getCurrentDiff();
        localStorage.setItem('current-diff', currentDiff);
    }
}


function forceMaxArraySize(arr, size) {
    var over = arr.length - size;
    arr.splice(0, over);
}

function getCurrentDiff() {
    var leftText = leftInputView.getText(), rightText = rightInputView.getText();
    return JSON.stringify({
        left: leftText, right: rightText
    });
}



window.getInputViews = function () {
    return {
        left: leftInputView,
        right: rightInputView
    };
}
window.compareJson = compareJson; 