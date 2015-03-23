$(function(){ 
        $('#exportExcel').click(function(e){            
            $("#tableToExport").html('');
            if($('#selectReporte').val() === 'rptIgnis'){
                convertNormalHtml('rptIgnis');
                $('#tableToExport').tableExport({type:'excel'});
                //window.open('data:application/vnd.ms-excel;filename=exportData.xls;' + base64data);
            }else{
                convertBalanceGeneralToNormal('table-balanceGrl');
                $('#tableToExport').tableExport({type:'excel'});
                //window.open('data:application/vnd.ms-excel;filename=exportData.xls;' + base64data);
            }
        });

        var convertBalanceGeneralToNormal = function(id){
            var table = $('#'+id);
            var tableHtmlToExport = document.getElementById('tableToExport');
            var theadPrincipal = document.createElement('thead');
            tableHtmlToExport.appendChild(theadPrincipal);

            // var tableHtml = '<table><thead>';
            table.find('thead').find('th').each(function(th, thVal){
                var trHeadPrincipal = document.createElement('tr');
                var thHeadPrincipal = document.createElement('th');
                thHeadPrincipal.setAttribute('colspan','6');
                thHeadPrincipal.setAttribute('style','text-align :center;');
                var txtHeadPrincipal = document.createTextNode($(this).html().trim());
                thHeadPrincipal.appendChild(txtHeadPrincipal);
                trHeadPrincipal.appendChild(thHeadPrincipal);
                theadPrincipal.appendChild(trHeadPrincipal);
                // tableHtml +='<tr><th colspan="6" style="text-align:center">' + $(this).html() +'</th></tr>';
            });
            console.log(tableHtmlToExport);
            // tableHtml+= '</thead><tbody>';
            var tbodyPrincipal = document.createElement('tbody');
            tableHtmlToExport.appendChild(tbodyPrincipal);
            //table insides
            table.find('[data-level="first"]').find('tbody').find('tr').find('td').each(function(){
                var tipo = $(this).find('span[name="first-title"]');
                var tipo_finded = tipo.attr('data-show');
                if(tipo_finded==='true'){
                    if(tipo.html()!== undefined){
                        if(tipo.html!=='undefined'){
                            var trFirstLevel = document.createElement('tr');
                            var tdFirstLevel = document.createElement('td');
                            tdFirstLevel.setAttribute('colspan','2');
                            tdFirstLevel.setAttribute('style','text-align:center;background-color:blue;color:white');
                            tdFirstLevel.appendChild(document.createTextNode(tipo.html()));
                            trFirstLevel.appendChild(tdFirstLevel);

                            for (var i = 0; i < 4; i++) {
                                var normalTD = document.createElement('td');
                                trFirstLevel.appendChild(normalTD);    
                            };
                            
                            tbodyPrincipal.appendChild(trFirstLevel);
                            // tableHtml += '<tr><td colspan="2" style="text-align:center;background-color:blue;color:white;">'+ tipo.html() +'</td><td></td><td></td><td></td><td></td></tr>';    
                            $(this).find('[data-level="second"]').find('tbody').find('tr').find('td').each(function(){
                                var cuenta = $(this).find('span[name="second-title"]');
                                var cuenta_finded = tipo.attr('data-show');
                                if(cuenta_finded==='true'){
                                    if(cuenta.html()!== undefined){
                                        if (cuenta.html()!=='undefined') {
                                            var trSecondLevel = document.createElement('tr');
                                            var tdSLWithStyle = document.createElement('td');
                                            var tdSecondLevel = document.createElement('td');
                                            tdSLWithStyle.setAttribute('style','width:80px');
                                            tdSecondLevel.appendChild(document.createTextNode(cuenta.html()));
                                            trSecondLevel.appendChild(tdSLWithStyle);
                                            trSecondLevel.appendChild(tdSecondLevel);
                                            for (var i = 0; i < 4; i++) {
                                                var normalTD = document.createElement('td');
                                                trSecondLevel.appendChild(normalTD);    
                                            };
                                            tbodyPrincipal.appendChild(trSecondLevel);
                                            // tableHtml += '<tr><td style="width:80px"></td><td>'+ cuenta.html() +'</td><td></td><td></td><td></td><td></td></tr>';
                                            $(this).find('[data-level="third"]').find('tbody').find('tr').each(function(){
                                                var subcuenta = $(this).find('td').find('span[name="third-title"]');
                                                var subcuenta_finded = subcuenta.attr('data-show');
                                                if(subcuenta_finded==='true'){
                                                    if(subcuenta.html()!== undefined){
                                                        if(subcuenta.html()!== 'undefined'){
                                                            var trThirdLevel = document.createElement('tr');
                                                            var tdTLWithStyle = document.createElement('td');
                                                            tdTLWithStyle.setAttribute('style','width:80px');
                                                            trThirdLevel.appendChild(tdTLWithStyle);
                                                            var tdThirdLevel = document.createElement('td');
                                                            var tdNormalThir_1 = document.createElement('td');
                                                            trThirdLevel.appendChild(tdNormalThir_1);
                                                            tdThirdLevel.appendChild(document.createTextNode(subcuenta.html()));
                                                            trThirdLevel.appendChild(tdThirdLevel);
                                                            
                                                            var tdNormalThir_2 = document.createElement('td');
                                                            trThirdLevel.appendChild(tdNormalThir_2);
                                                            
                                                            // tableHtml += '<tr><td style="width:80px"></td><td></td><td>'+ subcuenta.html() +'</td><td></td>';
                                                            $(this).find('td').find('span[name="third-total"]').each(function(){
                                                                var lasTD = document.createElement('td');
                                                                lasTD.appendChild(document.createTextNode($(this).html()));
                                                                trThirdLevel.appendChild(lasTD);
                                                                // tableHtml +='<td>'+ $(this).html() +'</td>';
                                                            });
                                                            // tableHtml +='</tr>';
                                                            tbodyPrincipal.appendChild(trThirdLevel);
                                                        }
                                                    }
                                                }
                                            });


                                            $(this).parent().find('[data-footer="third"]').find('tr').each(function(){
                                                var subcuenta = $(this).find('span[name="third-title"]');
                                                if(subcuenta.html()!== undefined){
                                                    if(subcuenta.html()!=='undefined'){
                                                        var trThirdLevelFooter = document.createElement('tr');
                                                        var tdNormalThird_1Footer = document.createElement('td');
                                                        var tdTLWithStyleFooter = document.createElement('td');
                                                        tdTLWithStyleFooter.setAttribute('colspan','2');
                                                        tdTLWithStyleFooter.setAttribute('style','text-align:center');
                                                        trThirdLevelFooter.appendChild(tdTLWithStyleFooter);
                                                        var tdThirdLevelFooter = document.createElement('td');
                                                        trThirdLevelFooter.appendChild(tdNormalThird_1Footer);
                                                        trThirdLevelFooter.appendChild(tdTLWithStyleFooter);
                                                        var tdNormalThird_2Footer = document.createElement('td');
                                                        trThirdLevelFooter.appendChild(tdNormalThird_2Footer);
                                                        // tableHtml += '<tr><td></td><td colspan="2">'+ subcuenta.html() +'</td><td></td>';
                                                        $(this).find('td').find('span[name="third-total"]').each(function(){
                                                            var lasTD = document.createElement('td');
                                                            lasTD.appendChild(document.createTextNode($(this).html()));
                                                            trThirdLevelFooter.appendChild(lasTD);
                                                            // tableHtml +='<td>'+ $(this).html() +'</td>';
                                                        });
                                                        // tableHtml +='</tr>';
                                                    }
                                                    tbodyPrincipal.appendChild(trThirdLevelFooter);
                                                    
                                                }
                                            });
                                        }
                                    }
                                }
                                //Here continue with account total
                            });
                        }
                    }
                }
            });
            
            var footer = $('#tblGeneral').find('[data-footer="principal"]').find('tbody');
            footer.find('tr').each(function(){
                var capital = $(this).find('td').find('span[name="principal-title"]');
                var totales = $(this).find('td').find('span[name="principal-total"]');
                if(capital.html()!==undefined){
                    if(capital.html()!=='undefined'){
                        var trFooter = document.createElement('tr');
                        var tdNormalFooter = document.createElement('td');
                        var tdWithStyleFooter = document.createElement('td');
                        tdWithStyleFooter.setAttribute('colspan','3');
                        tdWithStyleFooter.appendChild(document.createTextNode(capital.html()));
                        tdWithStyleFooter.setAttribute('style','text-align:center');
                        trFooter.appendChild(tdWithStyleFooter);
                        var tdFooter = document.createElement('td');
                        trFooter.appendChild(tdWithStyleFooter);
                        trFooter.appendChild(tdFooter);
                        // tableHtml += '<tr><td colspan="3" style="text-align:center">'+ capital.html() +'</td><td></td>';
                        totales.each(function(){
                            var lasTD = document.createElement('td');
                            lasTD.appendChild(document.createTextNode($(this).html()));
                            trFooter.appendChild(lasTD);
                            // tableHtml +='<td>'+ $(this).html() +'</td>';
                        });
                        tbodyPrincipal.appendChild(trFooter);
                        // tableHtml +='</tr>';
                    }
                }

            });
            // tableHtml += '</tbody></table>';
            // return tableHtml;    
        }

        var convertNormalHtml = function(id){
            var table = $('#rptIgnis');
            var tableHtmlToExport = document.getElementById('tableToExport');
            var thead = document.createElement('thead');
            
            var td = document.createElement('td');
            tableHtmlToExport.appendChild(thead);

            var tr = document.createElement('tr');
            thead.appendChild(tr);

            table.find('thead').find('tr').find('th').each(function(th, thVal){
                var th = document.createElement('th');
                var txt = document.createTextNode($(this).html().trim());
                th.appendChild(txt);
                tr.appendChild(th);
            });

            var tBody = document.createElement('tbody');
            tableHtmlToExport.appendChild(tBody);
            table.find('tbody').find('tr').each(function(){
                var trBody = document.createElement('tr');
                $(this).find('td').each(function(){
                    var tdBody =document.createElement('td');
                    var txtBody = document.createTextNode($(this).html().trim());
                    tdBody.appendChild(txtBody);
                    trBody.appendChild(tdBody);
                    tBody.appendChild(trBody);
                });
            });
        }

        $('#exportPDF').click(function(e){
            if($('#selectReporte').val() === 'rptIgnis'){
                convertNormalHtml('rptIgnis');
                $('#tableToExport').tableExport({type:'pdf',escape:'true',htmlContent:'true',pdfFontSize:4,pdfLeftMargin:20})
                e.preventDefault();
            }else if($('#selectReporte').val() === 'balanceGrl'){
                convertBalanceGeneralToNormal('table-balanceGrl');
                $('#tableToExport').tableExport({type:'pdf',escape:'true',htmlContent:'true',pdfFontSize:4,pdfLeftMargin:20})
                e.preventDefault();
            }
        });
        
        $('#reset').click(function(e){
            $("#tableToExport").html('');
        });
        
});