/*
 * Copyright (C) 2012 Ideaviate AB
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Calculator = function () {
    var self = this,
        decimalMark = ".",
        sum = 0;

    self.display = ko.observable("0");

    // Callback for each number button
    self.number = function (item, event) {   
        var button = event.target.innerText;

        // Make sure we only add one decimal mark
        if (button == decimalMark && self.display().indexOf(decimalMark) > -1)
            return;

        var newValue = (self.display() === "0" && button != decimalMark) ? button : self.display() + button; 
        self.display(newValue);            
    };

    // Callback for each operator button
    self.operator = function (item, event) {
        var button = event.target.innerText;
    };

    // Callback for each backspace button
    self.backspace = function (item, event) {
        self.display(self.display());
    };

    // Clear the calculator
    self.clear = function () {
        self.display("0");
        sum = 0;
    };
};

ko.applyBindings(new Calculator());