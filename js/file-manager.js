/*
 * file-manager.js
 *
 * Created on 23/02/2015
 *
 *
 * SIEL's file handling methods
 *
 * @version Revision 1.1.0
 * @since Build 1.0 (02 2015)
 * @author Pedro Montibeler
 */

var parsedFiles = []; // Armazena dados analisados dos arquivos de repertório
var fileNames = []; // Armazena o nome dos arquivos de repertório
var reforcoIndex = []; // Índice de reforço, determina se tarefa deve exibir reforço de imagem e/ou som
var progressIndex = []; // Índice de progresso, determina se repertório deve exibir barra de progresso
var escIndex = []; // Índice de "escape", determina se repertório deve exibir botão de saída durante sessão
var capsIndex = []; // Índice de exibição de letras, determina se repertório deve exibir letras maiúsculas (true) ou minúsculas (false)
var log = []; // Armazena os resultados das tarefas
var rowN = 0; // Salva o número de linhas atual da tabela com repertórios
/*checa se o formulario de info do aluno foi preenchido
function checkForm() {
    if(instrutor === undefined || instrutor === null){
        alert("Vc deve preencher o formulario com todas as informações");
    }
    else {
        alert("ok");
    }
}*/
function openFile(event) { // Quando adicionado arquivos de repertório, recupera arquivos e manda analisá-los	
    var files = event.target.files;
	for (var i = 0; i < files.length; i++) {
		parseFile(files[i]);
	}
}
    
function parseFile(file) { // Utiliza biblioteca Papa Parse para analisar conteúdo do arquivo .csv
	Papa.parse(file, {
		header: true,
		delimiter: ";",
		complete: function (results) { // Ao retornar resultados, armazená-los e atualizar tabela de repertório
			var repdata = results.data;
			parsedFiles.push(repdata);
			fileNames.push(file.name);
			var reptable = document.getElementById("rep-table");
			rowN++;
			var row = reptable.insertRow(rowN);
			var cell0 = row.insertCell(0);
			cell0.innerHTML = file.name;
			var cell1 = row.insertCell(1);
			cell1.innerHTML = repdata.length;
			var cell2 = row.insertCell(2);
			cell2.innerHTML = "<span onclick=\"editRep('"+file.name+"',"+(rowN-1)+")\" class=\"glyphicon glyphicon-edit btn btn-primary\" title=\"editar repertório\" style=\"color:#fff;\"></span>";
			var cell3 = row.insertCell(3);
			cell3.innerHTML = "<span onclick=\"delRep("+(rowN-1)+")\" class=\"glyphicon glyphicon-trash btn btn-danger\" title=\"remover repertório\" style=\"color:#fff;\"></span>";
			var cell4 = row.insertCell(4);
			cell4.innerHTML = "<span onclick=\"loadTasksLocal("+(rowN-1)+")\" class=\"glyphicon glyphicon-play btn btn-success\" title=\"executar repertório\" style=\"color:#fff;\"></span>";
			// Para cada repertório novo, criar um novo índice de reforço
			var rIndex = [];
			/*
			for (var j = 0; j < repdata.length; j++) {
				rIndex.push([false, false]); // Cada tarefa recebe dois booleanos: reforço tipo imagem e reforço tipo áudio
			}*/

		for(var k in parsedFiles) {
                        for(var l in parsedFiles[k]) {
                            if(parsedFiles[k][l]["Tipo de Repertorio"] == "Treino" || parsedFiles[k][l]["Tipo de Repertorio"] == "treino") {
                        rIndex.push([true,true]);
                        } else {
                            rIndex.push([false, false]);
                        }
                    }
                }
			reforcoIndex.push(rIndex);
			progressIndex.push(true);
			escIndex.push(true);
			capsIndex.push(true);
			log.push([]); // Para cada repertório novo, criar um novo vetor para log
		}
                
	});
        
}

/* Método para baixar um conteúdo string como arquivo dos principais navegadores,
recebe o conteúdo do arquivo como string, o nome do arquivo como string e o tipo de conteúdo como string*/
function download(strData, strFileName, strMimeType) {
	var D = document,
		 A = arguments,
		 a = D.createElement("a"),
		 d = A[0],
		 n = A[1],
		 t = A[2] || "text/plain";

    //build download link:
	a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


	if (window.MSBlobBuilder) { // IE10
		var bb = new MSBlobBuilder();
		bb.append(strData);
		return navigator.msSaveBlob(bb, strFileName);
	} /* end if(window.MSBlobBuilder) */



	if ('download' in a) { //FF20, CH19
		a.setAttribute("download", n);
		a.innerHTML = "downloading...";
		D.body.appendChild(a);
		setTimeout(function() {
			var e = D.createEvent("MouseEvents");
			e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
			D.body.removeChild(a);
		}, 66);
		return true;
	}; /* end if('download' in a) */



	//do iframe dataURL download: (older W3)
	var f = D.createElement("iframe");
	D.body.appendChild(f);
	f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
	setTimeout(function() {
		D.body.removeChild(f);
	}, 333);
	return true;
}
